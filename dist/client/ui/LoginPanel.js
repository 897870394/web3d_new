const React = require('react');
const Dialog = require('material-ui/Dialog')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];
const TextField = require('material-ui/TextField')['default'];
const $ = require('superagent');
const CryptoJS = require("crypto-js");

let LoginPanel = class LoginPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            usernameError: false,
            passwordError: false,
            errmsg: ''
        };
        //this.handleOpen = this.handleOpen.bind(this);
        //this.handleClose = this.handleClose.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    /*handleOpen() {
        this.setState((old) => {
            old.open = true;
            return old;
        });
    };
      handleClose() {
        this.setState({open: false});
    };*/

    handleUsername(_, value) {
        this.setState({
            username: value,
            usernameError: value.length === 0
        });
    }

    handlePassword(_, value) {
        this.setState({
            password: value,
            passwordError: value.length === 0
        });
    }

    handleSubmit() {
        if (this.state.username.length === 0) {
            this.setState({ usernameError: true });
            return;
        }
        if (this.state.password.length === 0) {
            this.setState({ passwordError: true });
            return;
        }
        let xxx = CryptoJS.AES.encrypt(JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            timestamp: Date.now()
        }), 'logthecatfish').toString();
        $.post('/login').send({ data: xxx }).then(res => {
            let data = res.body;
            if (data.code === 0) {
                // ????????????
                //this.setState({open: false});
                this.props.onLogin(data);
            } else {
                // ????????????
                this.setState({ errmsg: data.message });
            }
        });
    }

    handleRegister() {
        if (this.state.username.length === 0) {
            this.setState({ usernameError: true });
            return;
        }
        if (this.state.password.length === 0) {
            this.setState({ passwordError: true });
            return;
        }
        let xxx = CryptoJS.AES.encrypt(JSON.stringify({
            username: this.state.username,
            password: this.state.password
        }), 'logthecatfish').toString();
        $.post('/register').send({ data: xxx }).then(res => {
            let data = res.body;
            if (data.code === 0) {
                // ????????????
                this.props.onLogin(data);
            } else {
                // ????????????
                this.setState({ errmsg: data.message });
            }
        });
    }

    render() {
        const actions = [React.createElement(FlatButton, {
            label: '\u6CE8\u518C',
            primary: true,
            onClick: this.handleRegister }), React.createElement(FlatButton, {
            label: '\u767B\u5F55',
            primary: true,
            keyboardFocused: true,
            onClick: this.handleSubmit })];

        return React.createElement(
            Dialog,
            {
                title: '????????????????????????',
                actions: actions,
                modal: true,
                open: true,
                contentStyle: { width: '304px' } },
            React.createElement(
                'p',
                { style: { color: 'red', fontSize: '12px', margin: 0 } },
                this.state.errmsg
            ),
            React.createElement(TextField, {
                hintText: '\u7528\u6237\u540D',
                floatingLabelText: '\u7528\u6237\u540D',
                errorText: this.state.usernameError ? "?????????????????????" : "",
                value: this.state.username,
                onChange: this.handleUsername }),
            React.createElement(TextField, {
                hintText: '\u5BC6\u7801',
                floatingLabelText: '\u5BC6\u7801',
                errorText: this.state.passwordError ? "??????????????????" : "",
                type: 'password',
                value: this.state.password,
                onChange: this.handlePassword })
        );
    }

};


module.exports = LoginPanel;