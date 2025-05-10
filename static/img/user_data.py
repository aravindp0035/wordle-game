import mysql.connector

dataBase = mysql.connector.connect(
host ="localhost",
user ="root",
password ="admin",
database = "wordle"
)

mycursor = dataBase.cursor()


id= id+1
mycursor.execute("insert into users values (1, 'aravindp0035@gmail.com', 'aravindp01','admin')")

dataBase.commit()

dataBase.close()
