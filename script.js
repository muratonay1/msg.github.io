var clicked_id = "";
(function() {
    var chat = {
        messageToSend: '',
        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.renderMessage();
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button');
            this.$textarea = $('#message-to-send');
            this.$chatHistoryList = this.$chatHistory.find('ul');
            this.$messageWritingState = $('.message-writing-state');
            this.$contactClicked = $('.contact-li');
            this.buttonLogin = $('button-login');
        },
        bindEvents: function() {
            this.$button.on('click', this.addMessage.bind(this));
            this.$textarea.on('keyup', this.addMessageEnter.bind(this));
            this.$contactClicked.on('click', this.contactClicked.bind(this));
        },
        renderMessage: function() {
            this.scrollToBottom();
            if (this.messageToSend.trim() !== '') {
                var auth = JSON.parse(window.localStorage.getItem('prettyAuth'));
                var template = Handlebars.compile($("#message").html());
                var context = {
                    messageOutput: this.messageToSend,
                    time: this.getCurrentTime(),
                    to: document.getElementsByClassName('contactUserProfileImage')[0].id,
                    from: auth.username
                };
                firebase.database().ref('Messages/' + auth.username + "/" + document.getElementsByClassName('contactUserProfileImage')[0].id).push().set(context);
                firebase.database().ref('Messages/' + document.getElementsByClassName('contactUserProfileImage')[0].id + "/" + auth.username).push().set(context);
                this.scrollToBottom();
                this.$textarea.val('');
                // responses
                var templateResponse = Handlebars.compile($("#message-from").html());
                var contextResponse = {
                    response: this.getRandomItem(this.messageResponses),
                    time: this.getCurrentTime()
                };
                this.$messageWritingState.show();
                setTimeout(function() {
                    this.$chatHistoryList.append(templateResponse(contextResponse));
                    this.scrollToBottom();
                    this.$messageWritingState.hide();
                }.bind(this), 1500);
            }
        },
        addMessage: function() {
            //içeriğini aldı
            this.messageToSend = this.$textarea.val();
            //mesaj içeriğini aldıktan sonra render ediyor(ekrana basıyor)
            this.renderMessage();
        },
        addMessageEnter: function(event) {
            // mesaj gönderme
            if (event.keyCode === 13) {
                this.addMessage();
            }
        },
        contactClicked: function(params) {
            //console.log(params);
        },
        scrollToBottom: function() {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        getCurrentTime: function() {
            return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },
        getRandomItem: function(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    };
    chat.init();
    var contactList = {
        init: function() {
            this.cacheDOM();
            this.renderContactList();
            setHiddenChatArea(true);
        },
        cacheDOM: function() {
            this.$peopleList = $('.people-list');
            this.$contactList = this.$peopleList.find('ul');
        },
        renderContactList: function() {
            var template = Handlebars.compile($("#contact-list").html());
            //localde user bilgilerini koyduğumuz değişken
            var localUserList = {};
            firebase.database().ref("Users/").on("value", (users) => {
                var items = users.val();
                //refresh contact list
                document.getElementById('list-contact').innerHTML = "";
                Object.values(items).forEach((user) => {
                    if (user.username != window.localStorage.getItem('prettyAuth').jparse().jget('username')) {
                        localUserList.username = user.username;
                        localUserList.active = user.active ? "Online" : "Offline";
                        //<li> iteminin id'sini userın token'ı yapıyoruz
                        localUserList.id = user.username + "/" + user.token;
                        localUserList.profileImage = user.profileImage;
                        if (user.active) {
                            //online olan kaydı liste başına alma
                            this.$contactList.prepend(template(localUserList));
                            //online kaydın border rengi
                            document.getElementById(localUserList.id).style.border = "3px solid lightgreen";
                        } else {
                            //offline olaan kaydı liste sonuna ekleme
                            this.$contactList.append(template(localUserList));
                            //offline olan kaydın border rengi
                            document.getElementById(localUserList.id).style.border = "3px solid red";
                        }
                        document.getElementById(localUserList.id).style.borderRadius = "50%";
                    }
                })
            })
        }
    }
    contactList.init();
    var searchFilter = {
        options: { valueNames: ['name'] },
        init: function() {
            var userList = new List('people-list', this.options);
            var noItems = $('<li id="no-items-found">No items found</li>');

            userList.on('updated', function(list) {
                if (list.matchingItems.length === 0) {
                    $(list.list).append(noItems);
                } else {
                    noItems.detach();
                }
            });
        }
    };
    searchFilter.init();
})();

function setHiddenChatArea(options) {
    document.getElementsByClassName('chat-header')[0].hidden = options;
    document.getElementsByClassName('chat-history')[0].hidden = options;
    document.getElementsByClassName('chat-message')[0].hidden = options;
}

function clickUser(params) {

    clicked_id = params.children[0].id;
    clicked_profileImage = params.children[0].src;
    var contactListMessage = {
        init: function() {
            this.cacheDOM();
            this.renderContactMessage();
        },
        cacheDOM: function() {
            this.$peopleList = $('.people-list');
            this.$chatHeaderUser = $('.chat-with');
            this.$messageCount = $('.chat-num-messages');
            this.$active = $('#activateState');
            this.$contactUserProfileImage = $('.contactUserProfileImage');
            this.$contactList = this.$peopleList.find('ul');
            this.$chatHistory = $('.chat-history');
            this.$chatHistoryList = this.$chatHistory.find('ul');
        },
        scrollToBottom: function() {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        clearMessageArea: function() {
            this.$chatHistoryList[0].innerHTML = "";
        },
        renderContactMessage: function() {
            var auth = JSON.parse(window.localStorage.getItem('prettyAuth'));
            var clicked_username = clicked_id.split('/')[0];
            var clicked_activate = params.lastElementChild.children[1].textContent.trim();
            var clicked_profile_image_id = clicked_id.split('/')[0];
            this.$chatHeaderUser[0].textContent = clicked_username;
            this.$contactUserProfileImage[0].id = clicked_username;
            this.$contactUserProfileImage[0].src = clicked_profileImage;
            if (clicked_activate == "Online") {
                document.getElementById(clicked_username).style.border = "3px solid lightgreen"
            } else if (clicked_activate == "Offline") {
                document.getElementById(clicked_username).style.border = "3px solid red"
            }
            document.getElementById(clicked_username).style.borderRadius = "50%";
            setHiddenChatArea(false);
            this.$chatHistoryList[0].innerHTML = ""
            firebase.database().ref('Messages/' + auth.username + "/" + clicked_username).on("value", (snapshot) => {
                    var messagesList = Object.values(snapshot.val());
                    this.scrollToBottom();
                    //var auth = JSON.parse(window.localStorage.getItem('prettyAuth'));
                    var template = Handlebars.compile($("#message").html());
                    var templateResponse = Handlebars.compile($("#message-from").html());
                    var contextResponse = {
                        responseMessage: "",
                        responseDate: "",
                        responseTo: ""
                    };
                    let messageCount = 0;
                    while (this.$chatHistoryList[0].hasChildNodes()) { this.$chatHistoryList[0].removeChild(this.$chatHistoryList[0].firstChild) }
                    messagesList.forEach(item => {
                        messageCount++;
                        if (item.from == auth.username) {
                            contextResponse.responseMessage = item.messageOutput;
                            contextResponse.responseDate = item.time;
                            contextResponse.responseTo = "You";
                            this.$chatHistoryList.append(template(contextResponse));

                        } else {
                            contextResponse.responseMessage = item.messageOutput;
                            contextResponse.responseDate = item.time;
                            contextResponse.responseTo = document.getElementsByClassName('contactUserProfileImage')[0].id;
                            this.$chatHistoryList.append(templateResponse(contextResponse));
                        }
                    })
                    this.$messageCount[0].textContent = "already " + messageCount + " messages";
                    this.scrollToBottom();

                    /*
                    this.$messageWritingState.show();
                    setTimeout(function () {
                          
                          this.scrollToBottom();
                          this.$messageWritingState.hide();
                    }.bind(this), 1500);
                    */

                })
                //console.log(this.$active[0].textContent)
        }
    }
    contactListMessage.init();
}
$(document).ready(function() {
    // Prepare the preview for profile picture

});

function readURL(input) {
    if (input.files && input.files[0]) {
        console.log("uploaded image size => ", input.files[0].size, "KB");
        var reader = new FileReader();

        reader.onload = function(e) {
            // image resolution parameter increment = more hd && decrement bad resolution
            let image_resolution = 20;
            //console.log(imageManipulation(e.target.result, 10, 1));
            imageManipulation(e.target.result, image_resolution, 1).then((res) => {
                setTimeout(() => {
                    document.getElementById('wizardPicturePreview').src = res;
                    //$("#wizardPicturePreview").attr("src", res).fadeIn("slow");
                    console.log("new image size => ", res.length, " KB");
                }, 1000);


            });
        };
        reader.readAsDataURL(input.files[0]);
    }

    async function imageManipulation(dataUrl, targetFileSizeKb, maxDeviation = 50) {
        let originalFile = await urltoFile(dataUrl, "test.png", "image/png");
        if (originalFile.size / 1000 < targetFileSizeKb) return dataUrl; // File is already smaller

        let low = 0.0;
        let middle = 0.5;
        let high = 1.0;

        let result = dataUrl;

        let file = originalFile;

        while (Math.abs(file.size / 1000 - targetFileSizeKb) > maxDeviation) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const img = document.createElement("img");

            const promise = new Promise((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
            });

            img.src = dataUrl;

            await promise;

            canvas.width = Math.round(img.width * middle);
            canvas.height = Math.round(img.height * middle);
            context.scale(canvas.width / img.width, canvas.height / img.height);
            context.drawImage(img, 0, 0);
            file = await urltoFile(canvas.toDataURL(), "test.png", "image/png");

            if (file.size / 1000 < targetFileSizeKb - maxDeviation) {
                low = middle;
            } else if (file.size / 1000 > targetFileSizeKb) {
                high = middle;
            }

            middle = (low + high) / 2;
            result = canvas.toDataURL();
        }

        return result;
    }

    function urltoFile(url, filename, mimeType) {
        return fetch(url)
            .then(function(res) {
                return res.arrayBuffer();
            })
            .then(function(buf) {
                return new File([buf], filename, { type: mimeType });
            });
    }
}

function settingsOnChanges(visible) {
    if (!visible) {
        document.getElementById('settings').style.display = "none";
    } else {
        document.getElementById('settings').style.display = "flex";
        $("#wizard-picture").change(function() {
            readURL(this);
        })
        var storage = window.localStorage.getItem('prettyAuth').jparse();
        document.getElementById('wizardPicturePreview').src = storage.jget('profileImage');
        document.getElementById('settingText-Username').value = storage.jget('username');
        document.getElementById('settingText-Password').value = storage.jget('password');
    }


}

function saveChanges() {
    var updated = window.localStorage.getItem('prettyAuth').jparse();
    updated["profileImage"] = document.getElementById('wizardPicturePreview').src;
    firebase.database().ref("Users/" + updated.id).update(updated);
    window.localStorage.setItem('prettyAuth', updated.jstring());


}