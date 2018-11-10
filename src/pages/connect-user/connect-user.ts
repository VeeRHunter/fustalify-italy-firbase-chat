import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { ChatOneToOnePage } from '../chat-one-to-one/chat-one-to-one';

/**
 * Generated class for the ConnectUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect-user',
  templateUrl: 'connect-user.html',
})
export class ConnectUserPage {

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

  public newFriendsList: any[];
  public currentUser: any;

  public eachUser: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConnectUserPage');
    this.findNewFriends();
  }

  findNewFriends() {
    this.loadingProvider.show();

    this.dataProvider.getUsers().snapshotChanges().subscribe((accounts) => {

      // applying Filters


      this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account) => {
        this.loadingProvider.hide();
        this.newFriendsList = new Array();
        this.currentUser = account.payload.val();


        for (let list of accounts) {
          this.eachUser = list.payload.val();
          if (this.currentUser.userId !== this.eachUser.userId) {
            this.newFriendsList.push(list.payload.val());
          }
        }
        // console.log(accounts.payload.val());
        console.log(this.newFriendsList);


        // Add own userId as exludedIds.

        // Get requests of the currentUser.
        // this.dataProvider.getRequests(account.key).snapshotChanges().subscribe((requests) => {
        //   console.log(requests);
        //   // if (requests.payload.val() != null) {
        //   //   this.requestsSent = requests.payload.val().requestsSent;
        //   //   this.friendRequests = requests.payload.val().friendRequests;
        //   // }
        // });
      });

    });
  }

  gotoMessage(i) {
    console.log(this.newFriendsList[i]);
    let userId = this.newFriendsList[i].userId;
    this.navCtrl.push(ChatOneToOnePage, { userId: userId });
  }

}
