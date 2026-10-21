// Secure API skeleton: connect Manus OAuth/session middleware and Manus database before deployment.
// Deliberately fails closed; no fake login or localStorage database.
const express=require('express');const path=require('path');const app=express();app.use(express.json({limit:'64kb'}));app.use(express.static(__dirname));
app.use('/api',(req,res)=>res.status(503).json({error:'Manus-Anmeldung und gemeinsame Manus-Datenbank sind noch nicht mit diesem Projekt verbunden. Bitte Manus-Serverdienste konfigurieren.'}));
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`BMA-Verwaltung läuft auf Port ${port}; API bleibt bis zur Manus-Konfiguration gesperrt.`));
