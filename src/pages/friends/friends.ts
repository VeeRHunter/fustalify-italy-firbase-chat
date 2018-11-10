import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import firebase from 'firebase';
import { UserInfoPage } from '../user-info/user-info';
import { MessagePage } from '../message/message';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  public friends: any;
  public friendRequests: any = [];
  public searchFriend: any;
  public tab: any;
  public title: any;
  public requestsSent: any = [];
  public friendRequestCount = 0;

  public alert: any;
  public account: any;

  public accounts: any = [];
  public excludedIds: any = [];
  public searchUser: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public alertCtrl: AlertController,
    public firebaseProvider: FirebaseProvider,
    public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    this.tab = "friends";
    this.title = "Friends";

    this.searchFriend = '';
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).snapshotChanges().subscribe((requestsRes) => {
      let requests = requestsRes.payload.val();
      console.log(requests);
      // if (requests != null) {
      //   if (requests.friendRequests != null && requests.friendRequests != undefined)
      //     this.friendRequestCount = requests.friendRequests.length;
      //   else this.friendRequestCount = 0
      // }
      // else this.friendRequestCount = 0;
      console.log(this.friendRequestCount);
    });

    this.getFriends();
  }

  segmentChanged($event) {
    if (this.tab == 'friends') {
      this.title = "Friends"; this.getFriends();
    }
    else if (this.tab == 'requests') {
      this.title = "Friend Requests"; this.getFriendRequests();
    }
    else if (this.tab == 'search') {
      this.title = "Find New Friends"; this.findNewFriends();
    }
  }
  openFilter() {
    // this.findNewFriends();
    // let friendModal = this.modalCtrl.create(FriendsFilterPage);
    // friendModal.present();
    // friendModal.onDidDismiss(data => {
    //   console.log(data);
    //   if (data != undefined) {
    //     this.accounts = this.accounts.filter(acc => {
    //       if ((acc.age >= data.ageStart) && (acc.age <= data.ageEnd) && acc.location == data.location)
    //         return true;
    //       return false;
    //     })
    //   }
    // });

  }
  getFriends() {
    this.loadingProvider.show();
    this.friends = [];
    // Get user data on database and get list of friends.
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {

      // if (account.payload.val() != null && account.payload.val().friends != null) {
      //   for (var i = 0; i < account.payload.val().friends.length; i++) {
      //     this.dataProvider.getUser(account.payload.val().friends[i]).snapshotChanges().subscribe((friend) => {
      //       if (friend.key != null) {
      //         let friendData = { $key: friend.key, ...friend.payload.val() };
      //         this.addOrUpdateFriend(friendData);
      //       }
      //     });
      //   }
      // } else {
      //   this.friends = [];
      // }
      this.loadingProvider.hide();
    });
  }

  // Add or update friend data for real-time sync.
  addOrUpdateFriend(friend) {
    console.log(friend)
    if (!this.friends) {
      this.friends = [friend];
    } else {
      var index = -1;
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].$key == friend.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.friends[index] = friend;
      } else {
        this.friends.push(friend);
      }
    }
    console.log(this.friends);
  }

  // Proceed to userInfo page.
  viewUser(userId) {
    console.log(userId);
    this.app.getRootNav().push(UserInfoPage, { userId: userId });
  }

  // Proceed to chat page.
  message(userId) {
    this.app.getRootNav().push(MessagePage, { userId: userId });
  }


  // Manageing Friend Requests

  getFriendRequests() {
    this.friendRequests = [];
    this.requestsSent = [];

    this.loadingProvider.show();
    // Get user info
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
      this.account = account.payload.val();
      console.log(this.account);
      // Get friendRequests and requestsSent of the user.
      this.dataProvider.getRequests(this.account.userId).snapshotChanges().subscribe((requestsRes) => {
        // friendRequests.
        let requests = requestsRes.payload.val();
        if (requests != null) {
          // if (requests.friendRequests != null && requests.friendRequests != undefined) {
          //   this.friendRequests = [];
          //   this.friendRequestCount = requests.friendRequests.length;
          //   requests.friendRequests.forEach((userId) => {
          //     this.dataProvider.getUser(userId).snapshotChanges().subscribe((sender) => {
          //       sender = { $key: sender.key, ...sender.payload.val() };
          //       this.addOrUpdateFriendRequest(sender);
          //     });
          //   });
          // } else {
          //   this.friendRequests = [];
          // }
          // requestsSent.
          // if (requests.requestsSent != null && requests.requestsSent != undefined) {
          //   this.requestsSent = [];
          //   requests.requestsSent.forEach((userId) => {
          //     this.dataProvider.getUser(userId).snapshotChanges().subscribe((receiver) => {
          //       receiver = { $key: receiver.key, ...receiver.payload.val() };
          //       this.addOrUpdateRequestSent(receiver);
          //     });
          //   });
          // } else {
          //   this.requestsSent = [];
          // }
        }
        this.loadingProvider.hide();
      });
    });
  }



  // Add or update friend request only if not yet friends.
  addOrUpdateFriendRequest(sender) {
    if (!this.friendRequests) {
      this.friendRequests = [sender];
    } else {
      var index = -1;
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i].$key == sender.$key) {
          index = i;
        }
      }
      if (index > -1) {
        if (!this.isFriends(sender.$key))
          this.friendRequests[index] = sender;
      } else {
        if (!this.isFriends(sender.$key))
          this.friendRequests.push(sender);
      }
    }
  }

  // Add or update requests sent only if the user is not yet a friend.
  addOrUpdateRequestSent(receiver) {
    if (!this.requestsSent) {
      this.requestsSent = [receiver];
    } else {
      var index = -1;
      for (var j = 0; j < this.requestsSent.length; j++) {
        if (this.requestsSent[j].$key == receiver.$key) {
          index = j;
        }
      }
      if (index > -1) {
        if (!this.isFriends(receiver.$key))
          this.requestsSent[index] = receiver;
      } else {
        if (!this.isFriends(receiver.$key))
          this.requestsSent.push(receiver);
      }
    }
  }


  findNewFriends() {
    this.requestsSent = [];
    this.friendRequests = [];
    // Initialize
    this.loadingProvider.show();
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().snapshotChanges().subscribe((accounts) => {
      this.loadingProvider.hide();

      // applying Filters

      // let acc = accounts.filter(c => {
      //   if (c.key == null && c.key == undefined && c.payload.val() == null) return false;
      //   if (c.payload.val().name == '' || c.payload.val().name == ' ' || c.payload.val().name == undefined) return false;
      //   if (c.payload.val().publicVisibility == false) return false;
      //   return true;
      // });

      // this.accounts = acc.map(c => {
      //   return { $key: c.key, ...c.payload.val() }
      // })


      this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
        // Add own userId as exludedIds.
        // console.log(account.payload.val());
        this.excludedIds = [];
        this.account = account.payload.val();
        if (this.excludedIds.indexOf(account.key) == -1) {
          this.excludedIds.push(account.key);
        }
        // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        // if (account.payload.val() != null) {
        //   // console.log(account.payload.val().friends);
        //   if (account.payload.val().friends != null) {
        //     account.payload.val().friends.forEach(friend => {
        //       if (this.excludedIds.indexOf(friend) == -1) {
        //         this.excludedIds.push(friend);
        //       }
        //     });
        //   }
        // }
        // Get requests of the currentUser.
        // this.dataProvider.getRequests(account.key).snapshotChanges().subscribe((requests) => {
        //   if (requests.payload.val() != null) {
        //     this.requestsSent = requests.payload.val().requestsSent;
        //     this.friendRequests = requests.payload.val().friendRequests;
        //   }
        // });
      });

    });
  }

  // Send friend request.
  sendFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    }).present();
  }

  // Accept Friend Request.
  acceptFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject Request',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(user.$key);
            this.getFriendRequests();
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(user.$key);
            this.getFriendRequests();
          }
        }
      ]
    }).present();
  }

  // Cancel Friend Request sent.
  cancelFriendRequest(user) {
    this.alert = this.alertCtrl.create({
      title: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(user.$key);
            this.getFriendRequests();
          }
        }
      ]
    }).present();
  }

  // Checks if user is already friends with this user.
  isFriends(userId) {
    if (this.account.friends) {
      if (this.account.friends.indexOf(userId) == -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.friendRequests) {
      for (var j = 0; j < this.friendRequests.length; j++) {
        if (this.friendRequests[j] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

}
