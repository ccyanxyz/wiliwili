from Flask import Flask
import routes


app = Flask(__name__)

if __name__ == '__main__':
    app.debug = True
    host = '0.0.0.0'
    app.run(host = host)
