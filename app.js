const fs = require('fs');

const express = require("express");
const app = express();
const port = 8080;

//Logica de la Class
class Contenedor {
  constructor (nombre) {
    this.nombre = nombre;    
  }

  //funcion para leer el archivo
  async read () {
    try {      
      const data = fs.readFileSync(`./${this.nombre}.txt`, `utf-8`)
      const dataObj = JSON.parse(data)       
      return (dataObj)
    }
    catch (err) {      
      throw new Error('No se pudo leer archivo', err)
    }
  }

  //funcion para detectar el ID mas grande
  lastID = (arr) => {  
    let id = 0;
    if (arr.length > 0) {
      for (const el of arr ) {
        if (el.id > id) {
          id = el.id
        }
      }
    }
    return id
  } 

  //funcion para guardar un objeto en el archivo
  async save(object) {
      
    try {             
      const dataObj = await this.read()      
      const previusID = this.lastID(dataObj)      
      object.id = previusID + 1

      //agregar objeto al array  
      dataObj.push(object) 

      //reescribo el archivo con el nuevo objeto
      
      fs.writeFileSync(`./${this.nombre}.txt`, JSON.stringify(dataObj, null, 2))
      console.log('EXITO')
      return(previusID + 1)
    }
    catch (err) {      
      throw new Error('Error de escritura', err)
    }    
  }     

  //funcion para obtener objeto segun ID
  async getById(x) {
    
    try {             
      const dataObj = await this.read()    
      if (dataObj.length === 0) {return "Archivo Vacio"}  
      if (dataObj.some(el => el.id === x)) { 
      const newObject = dataObj.filter(el => el.id === x)
      return newObject[0]
      } else {return "No Existe Ese producto"} 
    }
    catch (err) {      
      throw new Error('Error de Lectura', err)
    }

  }

  //funcion que devuelve todos los objetos
  async getAll() {
    try {             
      const dataObj = await this.read()  
      return dataObj
    }
    catch (err) {      
      throw new Error('Error de Lectura', err)
    }
  }

  //funcion que elimina segun id
  async deleteById(x) {      
    try {                   
      const dataObj = await this.read()
      const newArr = dataObj.filter(el => el.id !== x)       
      //reescribo el archivo con el nuevo objeto      
      fs.writeFileSync(`./${this.nombre}.txt`, JSON.stringify(newArr, null, 2))
    }
    catch (err) {    
      throw new Error('Error de escritura', err)
    }    
  } 

  //funcion que elimina todos los objetos
  async deleteAll() {      
    try { 
      const newArr = [] 
      //reescribo el archivo vacio      
      fs.writeFileSync(`./${this.nombre}.txt`, JSON.stringify(newArr, null, 2))
      return ("Todos los Productos Fueron Eliminados")
    }
    catch (err) {      
      throw new Error('Error de escritura', err)
    }    
  }  
  
} 

//delcaro un nuevo objeto a artir de la class
const productos = new Contenedor("productos");

//Logica del servidor
app.get("/", (req, res) => {

  res.send('<h1>Bienvenidos al servidor express</h1>');
  
});

app.get("/productos", (req, res) => {

  productos.getAll()

  .then (data => data.map (function (el) {
    return el.title
  }))

  .then (data => res.send(data))

});

app.get("/productoRandom", (req, res) => {

  let x = Math.floor(Math.random()*3)+1;

  productos.getById(x)

  .then (data => res.send(data)) 
  
});

const server = app.listen(port, () => {
  console.log(`Servidor http escuchando en el puerto ${port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));



