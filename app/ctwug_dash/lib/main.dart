// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'login.dart';
import 'package:flutter/material.dart';

import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

final FirebaseAuth _auth = FirebaseAuth.instance;
final GoogleSignIn _googleSignIn = new GoogleSignIn();

void main() {
  runApp(new MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'CTWUG dash app',
      home: new LoginPage(title: 'CTWUG Dash'),
    );
  }
}

class RSS extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'CTWUG RSS',
      home: new RSSPage(title: 'RSS'),
    );
  }
}

class RSSPage extends StatefulWidget {
  RSSPage({Key key, this.title}) : super(key: key);

  final String title;

  List<Widget> items = new List();
  @override
  _RSSPageState createState() => new _RSSPageState();
}

class _RSSPageState extends State<RSSPage> {
  _fetchRssList() {
    List<Widget> items2 = new List();
    items2.add(new Card(
      child: new Text("test"),
    ));
    return items2;
  }

  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text(widget.title),
        ),
        body: new Column(
          children: <Widget>[
            new MaterialButton(
                child: new Text("List Rss"),
                color: Colors.blue,
                onPressed: () {
                  setState(() {
                    widget.items = _fetchRssList();
                  });
                }),
                new recyc
            new ListView(
              children: widget.items,

            )
          ],
        ));
  }
}

class LoginPage extends StatefulWidget {
  LoginPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  Future<String> _message = new Future<String>.value('');
  String verificationId;

  Future<String> _testSignInWithGoogle() async {
    final GoogleSignInAccount googleUser = await _googleSignIn.signIn();
    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;
    final FirebaseUser user = await _auth.signInWithGoogle(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    assert(user.email != null);
    assert(user.displayName != null);
    assert(!user.isAnonymous);
    assert(await user.getIdToken() != null);

    final FirebaseUser currentUser = await _auth.currentUser();
    assert(user.uid == currentUser.uid);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => RSS()),
    );

    return 'signInWithGoogle succeeded: $user';
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.title),
      ),
      body: new Column(
        children: <Widget>[
          new Center(
            child: new MaterialButton(
                child: const Text('Sign in with google'),
                color: Colors.blue,
                textColor: Colors.white,
                onPressed: () {
                  setState(() {
                    _message = _testSignInWithGoogle();
                  });
                }),
          ),
          new FutureBuilder<String>(
              future: _message,
              builder: (_, AsyncSnapshot<String> snapshot) {
                return new Text(snapshot.data ?? '',
                    style: const TextStyle(
                        color: const Color.fromARGB(255, 0, 155, 0)));
              }),
        ],
      ),
    );
  }
}
