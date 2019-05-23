const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
exports.run = async (client, msg, embed = [])=>{

const cep = args.join('');

request('https://viacep.com.br/ws/'+cep+'/json/',{json:true},function(err,res,body){
	if(body.erro == true) return msg.channel.send(`:face_palm: **|** ${msg.author}, cep inexistente!`);
	if(!cep) return msg.channel.send(`:face_palm: **|** ${msg.author}, dê um cep para verificar!`);
	if(isNaN(cep) == true) return msg.channel.send(`:face_palm: **|** ${msg.author}, utilize apenas números!`);
	if(cep.length > 8 || cep.length < 8) return msg.channel.send(`:face_palm: **|** ${msg.author}, cep inválido!`);
	var complemento;

	if(body.complemento < 1){
		complemento = "Nenhum"
	}else{
		complemento = body.complemento;
	}

	const eCep = new Discord.RichEmbed()
	.setTitle(":book: Informações sobre o CEP")
	.addField(':package: | Logradouro', body.logradouro, inline=true)
	.addField(':closed_lock_with_key: | Complemento', complemento, inline=true)
	.addField(':department_store: | Bairro', body.bairro, inline=true)
	.addField(':homes: | Cidade', body.localidade+" - "+body.uf, inline=true) 
	msg.reply({embed:eCep});
});


};

exports.conf = {
  aliases: [],
};

exports.ajuda = {
  nome : "cep",
  desc : "Informações sobre um CEP"
};