//Main Execution File of the Server
import app from './app'; //Exported App importing here
//Execute Connection to BDD before launching the Server
import './database'; 

app.listen(app.get('port')); //Recovering Port from app.ts
console.log('Server on PortNumber: ',app.get('port'));