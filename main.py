from  flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template("Home.html")

@app.route('/research')
def research():
    return render_template("Research.html")

@app.route('/publications')
def publications():
    return render_template("Publications.html")

@app.route('/courses')
def courses():
    return render_template("Courses.html")

@app.route('/gallery')
def gallery():
    return render_template("Gallery.html")

@app.route('/contact')
def contact():
    return render_template("Contact.html")


if __name__ == "__main__":
    app.run(debug=True)