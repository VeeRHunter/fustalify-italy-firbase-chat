import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
// import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/take';
import { DataProvider } from '../data/data';
import { AlertProvider } from '../alert/alert';
import { LoadingProvider } from '../loading/loading';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  public requestsFromServer1: any = {};
  public requestsFromServer2: any = {};

  public friendsFromServer1: any = {};
  public friendsFromServer2: any = {};

  constructor(public angularfire: AngularFireDatabase,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,
  ) {
    console.log("Initializing Firebase Provider");
  }

  // Send friend request to userId.
  sendFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var requestsSent;
    // Use take(1) so that subscription will only trigger once.
    this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
      console.log(requests.payload.val());
      this.requestsFromServer1 = requests;
      if (requests.payload.val() != null && this.requestsFromServer1.payload.val().requestsSent != null)
        requestsSent = this.requestsFromServer1.payload.val().requestsSent;

      if (requestsSent == null || requestsSent == undefined) {
        requestsSent = [userId];
      } else {
        if (requestsSent.indexOf(userId) == -1)
          requestsSent.push(userId);
      }
      // Add requestsSent information.
      this.angularfire.object('/requests/' + loggedInUserId).update({
        requestsSent: requestsSent
      }).then((success) => {
        var friendRequests;
        this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
          this.requestsFromServer2 = requests;
          if (requests.payload.val() != null && this.requestsFromServer2.payload.val().friendRequests != null)
            friendRequests = this.requestsFromServer2.payload.val().friendRequests;

          if (friendRequests == null) {
            friendRequests = [loggedInUserId];
          } else {
            if (friendRequests.indexOf(userId) == -1)
              friendRequests.push(loggedInUserId);
          }
          // Add friendRequest information.
          this.angularfire.object('/requests/' + userId).update({
            friendRequests: friendRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestSent();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Cancel friend request sent to userId.
  cancelFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var requestsSent;
    this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
      this.requestsFromServer1 = requests;
      requestsSent = this.requestsFromServer1.payload.val().requestsSent;
      requestsSent.splice(requestsSent.indexOf(userId), 1);
      // Update requestSent information.
      this.angularfire.object('/requests/' + loggedInUserId).update({
        requestsSent: requestsSent
      }).then((success) => {
        var friendRequests;
        this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
          this.requestsFromServer2 = requests;
          friendRequests = this.requestsFromServer2.payload.val().friendRequests;
          console.log(friendRequests);
          friendRequests.splice(friendRequests.indexOf(loggedInUserId), 1);
          // Update friendRequests information.
          this.angularfire.object('/requests/' + userId).update({
            friendRequests: friendRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestRemoved();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Delete friend request.
  deleteFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var friendRequests;
    this.dataProvider.getRequests(loggedInUserId).snapshotChanges().take(1).subscribe((requests) => {
      this.requestsFromServer1 = requests;
      friendRequests = this.requestsFromServer1.payload.val().friendRequests;
      console.log(friendRequests);
      friendRequests.splice(friendRequests.indexOf(userId), 1);
      // Update friendRequests information.
      this.angularfire.object('/requests/' + loggedInUserId).update({
        friendRequests: friendRequests
      }).then((success) => {
        var requestsSent;
        this.dataProvider.getRequests(userId).snapshotChanges().take(1).subscribe((requests) => {
          this.requestsFromServer2 = requests;
          requestsSent = this.requestsFromServer2.payload.val().requestsSent;
          requestsSent.splice(requestsSent.indexOf(loggedInUserId), 1);
          // Update requestsSent information.
          this.angularfire.object('/requests/' + userId).update({
            requestsSent: requestsSent
          }).then((success) => {
            this.loadingProvider.hide();

          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
        //TODO ERROR
      });
    });
  }

  // Accept friend request.
  acceptFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    // Delete friend request.
    this.deleteFriendRequest(userId);

    this.loadingProvider.show();
    this.dataProvider.getUser(loggedInUserId).snapshotChanges().take(1).subscribe((account) => {
      this.friendsFromServer1 = account;
      var friends = this.friendsFromServer1.payload.val().friends;
      if (!friends) {
        friends = [userId];
      } else {
        friends.push(userId);
      }
      // Add both users as friends.
      this.dataProvider.getUser(loggedInUserId).update({
        friends: friends
      }).then((success) => {
        this.dataProvider.getUser(userId).snapshotChanges().take(1).subscribe((account) => {
          this.friendsFromServer1 = account;
          var friends = this.friendsFromServer1.payload.val().friends;
          if (!friends) {
            friends = [loggedInUserId];
          } else {
            friends.push(loggedInUserId);
          }
          this.dataProvider.getUser(userId).update({
            friends: friends
          }).then((success) => {
            this.loadingProvider.hide();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  setOnlineState() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).update({ 'online': true });
  }

  setOfflineState() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).update({ 'online': false });
  }

}
