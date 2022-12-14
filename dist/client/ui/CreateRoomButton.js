const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton')['default'];
const ContentAdd = require('material-ui/svg-icons/content/add')['default'];
const Dialog = require('material-ui/Dialog')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];
const TextField = require('material-ui/TextField')['default'];
const SelectField = require('material-ui/SelectField')['default'];
const MenuItem = require('material-ui/MenuItem')['default'];
const Client = require('../Client');

let CreateRoomButton = class CreateRoomButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            roomName: '无标题房间',
            roomType: 1,
            roomPassword: ''
        };

        this.handleClose.bind(this);
        this.handleOpen.bind(this);
        this.handleRoomName.bind(this);
        this.handleRoomPassword.bind(this);
        this.handleCreateRoom.bind(this);
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleRoomName(_, value) {
        this.setState({ roomName: value });
    }

    handleRoomPassword(_, value) {
        this.setState({ roomPassword: value });
    }

    handleRoomType(_, __, value) {
        this.setState({ roomType: value });
    }

    handleCreateRoom() {
        let hasPw = this.state.roomPassword.trim().length > 0;
        Client.current.createRoom(this.state.roomName, this.state.roomType, hasPw ? this.state.roomPassword : null, room => {
            this.handleClose();
            Client.current.joinRoom(room.id, hasPw ? this.state.roomPassword : null, data => {
                if (data.ret === 0) {
                    room.existPlayers = data.existPlayers || [];
                    this.props.onJoinRoom(room);
                }
            });
        });
    }

    render() {
        const actions = [React.createElement(FlatButton, {
            label: '\u63D0\u4EA4',
            primary: true,
            keyboardFocused: true,
            onClick: this.handleCreateRoom.bind(this) })];

        return React.createElement(
            FloatingActionButton,
            { style: { position: 'fixed', bottom: '75px', right: '75px' }, onClick: this.handleOpen.bind(this) },
            React.createElement(ContentAdd, null),
            React.createElement(
                Dialog,
                {
                    title: '创建房间',
                    actions: actions,
                    model: false,
                    open: this.state.open,
                    onRequestClose: this.handleClose.bind(this),
                    contentStyle: { width: '304px' } },
                React.createElement(TextField, {
                    floatingLabelText: '房间名',
                    floatingLabelFixed: true,
                    value: this.state.roomName,
                    onChange: this.handleRoomName.bind(this) }),
                React.createElement('br', null),
                React.createElement(TextField, {
                    hintText: '留空以不设密码',
                    floatingLabelText: '房间密码',
                    floatingLabelFixed: true,
                    value: this.state.roomPassword,
                    onChange: this.handleRoomPassword.bind(this) }),
                React.createElement('br', null),
                React.createElement(
                    SelectField,
                    {
                        floatingLabelText: '\u7C7B\u578B',
                        value: this.state.roomType,
                        onChange: this.handleRoomType.bind(this) },
                    React.createElement(MenuItem, { value: 1, primaryText: '\u56FE\u7075\u673A' }),
                    React.createElement(MenuItem, { value: 2, primaryText: '\u6C49\u8BFA\u5854' }),
                    React.createElement(MenuItem, { value: 3, primaryText: '\u592A\u9633\u7CFB' }),
                    React.createElement(MenuItem, { value: 4, primaryText: '\u6392\u5E8F' })
                )
            )
        );
    }
};


module.exports = CreateRoomButton;