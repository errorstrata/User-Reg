from flask import Flask,request,jsonify
from flask_restful import Api,Resource
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

app = Flask(__name__)
api = Api(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'kevinˋs-super-secret-key'
db = SQLAlchemy(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

class UsersModel(db.Model):
 id = db.Column(db.Integer,primary_key = True)
 name = db.Column(db.String)
 email = db.Column(db.String)
 age = db.Column(db.Integer)
 password = db.Column(db.String)
 
with app.app_context():
 db.create_all()

class DbManager(Resource):
	def post(self):
		data = request.json
		name = data.get('name')
		age = data.get('age')
		email = data.get('email')
		password = generate_password_hash(data.get('password'))
		
		user = UsersModel(
		   name = name,
		   age = age,
		   email = email,
		   password = password
		)
		db.session.add(user)
		db.session.commit()
		
		return {'message':'Account registered successfully.'}

	def get(self):
	 users = UsersModel.query.all()
	 user = [{
	  u.email : {'name':u.name, 'email':u.email, 'age':u.age,'password':u.password }}for u in users]
	 return jsonify(user)

class Login(Resource):
	def post(self):
		data = request.json
		shared_email = data.get('email')
		shared_password = data.get('password')
		
		#verify the password
		user = UsersModel.query.filter_by(email = shared_email).first() 
		
		if user and check_password_hash(user.password , data.get('password')):
			token = s.dumps({'user_id': user.id})
			return {'token':token}, 200
		return{'message':'UnAthorised'}, 401
		
		
class Dashboard(Resource):
  def post(self):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer'):
      return {'message':'token Missing'}, 401
    try:
      token = auth_header.split()[1]
      data = s.loads(token, max_age = 3600)
      user_id = data['user_id']
      users = db.session.get(UsersModel,user_id)
      user = [{users.email : {'name':users.name, 'email':users.email, 'age':users.age}}]
      return jsonify(user)
      #return{'message':user},200
    except SignatureExpired:
      return {'message':'token expired'}
    except BadSignature:
      return {'message':'Invalid token'}
		
api.add_resource(DbManager,'/signup')
api.add_resource(Login,'/login')
api.add_resource(Dashboard, '/Dashboard')
