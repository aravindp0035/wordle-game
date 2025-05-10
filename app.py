from flask import Flask, render_template, request, redirect, url_for, session, flash
import json
import os

app = Flask(__name__)
app.secret_key = 'codersessionkey'
users_file = 'users.json'


# Helper function to read users from JSON file
def load_users():
    if os.path.exists(users_file):
        with open(users_file, 'r') as f:
            return json.load(f)
    return {}


# Helper function to save users to JSON file
def save_users(users):
    with open(users_file, 'w') as f:
        json.dump(users, f, indent=4)


@app.route('/')
def home():
    username = session.get('username')
    return render_template('home.html', username=username)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_users()

        if username in users and users[username] == password:
            flash("User found and login successful")
            session['username'] = username
            return redirect(url_for('home'))
        elif username in users:
            flash("Password is wrong, Try Again!!")
        else:
            flash("User not found, Please Register")
            return redirect(url_for('register'))

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username1')
        password = request.form.get('password1')

        users = load_users()

        if username in users:
            flash('User Already registered, Please login')
            return redirect(url_for('login'))
        else:
            users[username] = password
            save_users(users)
            flash('Registration successful, Please Login')
            return redirect(url_for('login'))

    print(load_users())  # For debugging
    return render_template('register.html')

@app.route('/game')
def game():
    render_template('game.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash("Successfully logged out.")
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True)
