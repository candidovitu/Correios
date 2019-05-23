const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const prefix = config.prefixo;

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'),
        ano  = data.getFullYear(),
        hora = data.getHours(),
        min = data.getMinutes();
    return dia+"/"+mes+"/"+ano+" | "+hora+":"+min;
}


client.on('ready',()=>{
	client.user.setActivity('suas encomendas atrasarem desde 1969!', {type:'WATCHING'});
	console.log('Iniciado');
});

client.comandos = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(`./comandos/`, (e, arquivos) => {
  if(e) console.error(e);
  console.log(`${arquivos.length} comandos carregados.`);
  arquivos.forEach(f=> {
    let props = require(`./comandos/${f}`);
    console.log('[COMANDO]', `${props.ajuda.nome.toUpperCase()} carregado.`);
    client.comandos.set(props.ajuda.nome, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.ajuda.nome);

    });
  });
});

client.on('message', msg=>{  

    if(!msg.content.startsWith(prefix)) return;
    var comando = msg.content.split(" ")[0].slice(prefix.length).toLowerCase();
    var args = msg.content.split(" ").slice(1);
    let cmd;
   if (client.comandos.has(comando)) {
    cmd = client.comandos.get(comando)
   } else if (client.aliases.has(comando)) {
    cmd = client.comandos.get(client.aliases.get(comando));
   }
   try{
      cmd.run(client, msg, args);
     }catch(e){
     	if(msg.author.id === config.dono){
     		msg.channel.send(`:desktop: **|** Ocorreu um erro, ${msg.author}.\n:scroll: **|** O erro foi enviado em sua DM!`);
     		msg.author.send(e.toString());
     	}else{

     		msg.channel.send(`:face_palm: **|** Ocorreu um erro, ${msg.author}!`);
     	}
     return;
     }
});

client.login(config.token);