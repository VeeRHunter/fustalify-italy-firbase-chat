import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ModalController, Keyboard, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingProvider } from '../../providers/loading/loading';
import { ImageProvider } from '../../providers/image/image';
import { Camera } from '@ionic-native/camera';
import { Contacts } from '@ionic-native/contacts';
import { Geolocation } from '@ionic-native/geolocation';

import * as firebase from 'firebase';
import { UserInfoPage } from '../user-info/user-info';
import { ImageModalPage } from '../image-modal/image-modal';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the ChatOneToOnePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-one-to-one',
  templateUrl: 'chat-one-to-one.html',
})
export class ChatOneToOnePage {
  @ViewChild(Content) content: Content;
  public userId: any;
  public title: any;
  public message: any;
  public conversationId: any;
  public messages: any;
  public updateDateTime: any;
  public messagesToShow: any;
  public startIndex: any = -1;
  // Set number of messages to show.
  public numberOfMessages = 10;
  public loggedInUserId: any;
  public messagesFromServer: any = {};
  public userFromServer: any = {};
  public chatUserFromServer: any = {};
  public conversationIdFromServer: any = {};
  public unreadMessage = 0;
  public totalMessageLength = 0;
  public showMessageLength = 0;
  public chatUserImage = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public angularfire: AngularFireDatabase,
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController,
    public imageProvider: ImageProvider,
    public modalCtrl: ModalController,
    public camera: Camera,
    public actionSheet: ActionSheetController,
    public contacts: Contacts,
    public geolocation: Geolocation,
    // public loginProvider: LoginProvider,
  ) {
    console.log('asidhflaisudhlfi');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatOneToOnePage');

    this.userId = this.navParams.get('userId');
    this.loggedInUserId = firebase.auth().currentUser.uid;

    // Get friend details.

    // Get conversationInfo with friend.
    this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.userId).snapshotChanges().subscribe((conversation) => {
      if (conversation.payload.exists()) {
        // console.log(conversation.payload.val());
        // User already have conversation with this friend, get conversation

        this.conversationIdFromServer = conversation;
        this.conversationId = this.conversationIdFromServer.payload.val().conversationId;

        this.dataProvider.getUser(this.userId).snapshotChanges().subscribe((result) => {
          this.chatUserFromServer = result.payload.val();
          console.log(this.chatUserFromServer);
          this.chatUserImage = this.chatUserFromServer.img;
          this.title = this.chatUserFromServer.name;
          for (var key in this.chatUserFromServer.conversations) {
            console.log(this.conversationId);
            console.log(key);
            if (this.conversationId === this.chatUserFromServer.conversations[key].conversationId) {
              console.log("messagesRead  " + key + this.chatUserFromServer.conversations[key].messagesRead);
              this.unreadMessage = this.chatUserFromServer.conversations[key].messagesRead;
            }
          }
        }, err => {
          console.log(err);
        });

        // Get conversation
        this.dataProvider.getConversationMessages(this.conversationId).snapshotChanges().subscribe((messagesRes) => {

          this.messagesFromServer = messagesRes.payload.val();
          // console.log(this.messagesFromServer);
          if (this.messagesFromServer == null)
            this.messagesFromServer = [];

          this.messagesToShow = [];
          // if (this.messages) {
          //   // Just append newly added messages to the bottom of the view.
          //   if (this.messagesFromServer.length > this.messages.length) {
          //     let message = this.messagesFromServer[this.messagesFromServer.length - 1];

          //     this.dataProvider.getUser(message.sender).snapshotChanges().subscribe((user) => {
          //       this.userFromServer = user;
          //       message.avatar = this.userFromServer.payload.val().img;
          //     });
          //     this.messages.push(message);
          //     this.messagesToShow.push(message);
          //   }
          // } else {
          // Get all messages, this will be used as reference object for messagesToShow.
          this.messages = [];
          this.messagesFromServer.forEach((message) => {
            this.dataProvider.getUser(message.sender).snapshotChanges().subscribe((user) => {
              this.userFromServer = user;
              message.avatar = this.userFromServer.payload.val().img;
            });
            this.messages.push(message);
          });
          // Load messages in relation to numOfMessages.
          // if (this.startIndex == -1) {
          //   // Get initial index for numberOfMessages to show.
          //   if ((this.messages.length - this.numberOfMessages) > 0) {
          //     this.startIndex = this.messages.length - this.numberOfMessages;
          //   } else {
          //     this.startIndex = 0;
          //   }
          // }
          if (!this.messagesToShow) {
            this.messagesToShow = [];
          }
          // Set messagesToShow
          for (var i = 0; i < this.messages.length; i++) {
            this.messagesToShow.push(this.messages[i]);
          }
          this.loadingProvider.hide();
          // }
          if (this.messages) {
            this.totalMessageLength = this.messages.length;
          }
          // this.showMessageLength = this.messagesToShow.length;
          // if (this.totalMessageLength - this.unreadMessage > this.showMessageLength) {
          //   this.loadPreviousMessages();
          // } else {
          //   const currentUnreadMessage = this.unreadMessage;
          //   this.unreadMessage = this.showMessageLength - (this.totalMessageLength - currentUnreadMessage);
          // }
          if (localStorage.getItem('loadMore') === 'loadMoreMessage') {
            this.scrollTop();
          } else {
            this.scrollBottom();
          }
        });
      }
    });

    // Update messages' date time elapsed every minute based on Moment.js.
    if (!this.updateDateTime) {
      this.updateDateTime = setInterval(function () {
        if (this.messages) {
          this.messages.forEach((message) => {
            let date = message.date;
            message.date = new Date(date);
          });
        }
      }, 60000);
    }

  }

  ionViewDidEnter() {
    this.scrollBottom();
  }

  // Load previous messages in relation to numberOfMessages.
  loadPreviousMessages() {
    // Show loading.
    this.loadingProvider.show();
    setTimeout(() => {
      // Set startIndex to load more messages.
      if ((this.startIndex - this.numberOfMessages) > -1) {
        this.startIndex -= this.numberOfMessages;
      } else {
        this.startIndex = 0;
      }
      // Refresh our messages list.
      this.messages = null;
      this.messagesToShow = null;

      localStorage.setItem('loadMore', 'loadMoreMessage');

      // this.scrollTop();

      // Populate list again.
      this.ionViewDidLoad();
    }, 1000);
  }

  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    this.setMessagesRead();
  }

  // Check if currentPage is active, then update user's messagesRead.
  setMessagesRead() {
    firebase.database().ref('/conversations/' + this.conversationId + '/messages').once('value', snap => {
      // console.log(snap.val());
      if (snap.val() != null) {
        this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.userId).update({
          messagesRead: snap.val().length
        });
      }
    });
  }


  scrollBottom() {

    let that = this;
    setTimeout(() => {
      that.content.scrollToBottom();
    }, 300);
    that.setMessagesRead();
  }

  // Scroll to top of the page after a short delay.
  scrollTop() {
    let that = this;
    localStorage.setItem('loadMore', '');
    setTimeout(() => {
      that.content.scrollToTop();
    }, 300);
  }


  // Check if the user is the sender of the message.
  isSender(message) {
    if (message.sender == this.loggedInUserId) {
      return true;
    } else {
      return false;
    }
  }


  // Send message, if there's no conversation yet, create a new conversation.
  send(type) {
    if (this.message) {
      // User entered a text on messagebox
      if (this.conversationId) {
        let messages = JSON.parse(JSON.stringify(this.messages));
        messages.push({
          date: new Date().toString(),
          sender: this.loggedInUserId,
          type: type,
          message: this.message
        });

        // Update conversation on database.
        this.dataProvider.getConversation(this.conversationId).update({
          messages: messages
        });
        // Clear messagebox.
        this.message = '';
      } else {
        // New Conversation with friend.
        var messages = [];
        messages.push({
          date: new Date().toString(),
          sender: this.loggedInUserId,
          type: type,
          message: this.message
        });
        var users = [];
        users.push(this.loggedInUserId);
        users.push(this.userId);
        // Add conversation.
        this.angularfire.list('conversations').push({
          dateCreated: new Date().toString(),
          messages: messages,
          users: users
        }).then((success) => {
          let conversationId = success.key;
          this.message = '';
          // Add conversation reference to the users.
          this.angularfire.object('/accounts/' + this.loggedInUserId + '/conversations/' + this.userId).update({
            conversationId: conversationId,
            messagesRead: 1
          });
          this.angularfire.object('/accounts/' + this.userId + '/conversations/' + this.loggedInUserId).update({
            conversationId: conversationId,
            messagesRead: 0
          });
        });
      }
      this.scrollBottom();
    }
  }

  viewUser(userId) {
    this.navCtrl.push(UserInfoPage, { userId: userId });
  }


  attach() {
    let action = this.actionSheet.create({
      title: 'Choose attachments',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.CAMERA).then((url) => {
            this.message = url;
            this.send("image");
          });
        }
      }, {
        text: 'Photo Library',
        handler: () => {
          this.imageProvider.uploadPhotoMessage(this.conversationId, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
            console.log(url);
            this.message = url;
            this.send("image");
          });
        }
      },
      {
        text: 'Video',
        handler: () => {
          this.imageProvider.uploadVideoMessage(this.conversationId).then(url => {
            this.message = url;
            this.send("video");
          });
        }
      }
        //   , {
        //   text: 'Location',
        //   handler: () => {
        //     this.geolocation.getCurrentPosition({
        //       timeout: 5000
        //     }).then(res => {
        //       let locationMessage = "Location:<br> lat:" + res.coords.latitude + "<br> lng:" + res.coords.longitude;
        //       let mapUrl = "<a href='https://www.google.com/maps/search/" + res.coords.latitude + "," + res.coords.longitude + "'>View on Map</a>";

        //       let confirm = this.alertCtrl.create({
        //         title: 'Your Location',
        //         message: locationMessage,
        //         buttons: [{
        //           text: 'cancel',
        //           handler: () => {
        //             console.log("canceled");
        //           }
        //         }, {
        //           text: 'Share',
        //           handler: () => {
        //             this.message = locationMessage + "<br>" + mapUrl;
        //             this.send("location");
        //           }
        //         }]
        //       });
        //       confirm.present();
        //     }, locationErr => {
        //       console.log("Location Error" + JSON.stringify(locationErr));
        //     });
        //   }
        // }, {
        //   text: 'Contact',
        //   handler: () => {
        //     this.contacts.pickContact().then(data => {
        //       let name;
        //       if (data.displayName !== null) name = data.displayName;
        //       else name = data.name.givenName + " " + data.name.familyName;
        //       this.message = "<b>Name:</b> " + name + "<br><b>Mobile:</b> <a href='tel:" + data.phoneNumbers[0].value + "'>" + data.phoneNumbers[0].value + "</a>";
        //       this.send("contact");
        //     }, err => {
        //       console.log(err);
        //     })
        //   }
        // }
        , {
        text: 'cancel',
        role: 'cancel',
        handler: () => {
          console.log("cancelled");
        }
      }]
    });
    action.present();
  }

  // Enlarge image messages.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create(ImageModalPage, { img: img });
    imageModal.present();
  }

}
