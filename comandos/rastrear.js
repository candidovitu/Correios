const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
exports.run = async (client, msg, embed = [])=>{

const codigoObj = args.join('');

var converter = function(data){
    var d = new Date(data);

    var dia = d.getUTCDay().toString();
    var diaF = (dia.length == 1) ? '0'+dia : dia;
    var mes = (d.getMonth()+1).toString();
    var mesF = (mes.length == 1) ? '0'+mes : mes;
    var ano = d.getUTCFullYear();

    var hora = d.getUTCHours();
    var horaF = (hora.length == 1) ? '0'+hora : hora;
    var min = d.getUTCMinutes();
    var minF = (min.length == 1) ? '0'+hora : hora;
    return `${diaF}/${mesF}/${ano} ás ${horaF}:${minF}`;

}


var enviar = function(objeto){
    request('https://rastrojs.herokuapp.com/track/'+objeto+'/json',{json:true},function(err,res,body){
        var i = "";
        for(i in body.data.track){
            var observacao = "";
            if(body.data.track[i].observation == null){
                observacao = 'Nenhuma observação'
            }else{
                observacao = body.data.track[i].observation;
            }

            var status = body.data.track[i].status.toUpperCase();
            const eRastreio = new Discord.RichEmbed()
            .setTitle(status)
            .setDescription(observacao)
            .addField(':calendar: | Data', converter(body.data.track[i].trackedAt))
            .addField(':airplane: | Local', body.data.track[i].unit)
            .setColor('#7289DA')
            msg.author.send({embed:eRastreio});
        }
    });
}

if(!codigoObj) return msg.channel.send(`:face_palm: **|** ${msg.author}, dê o código do objeto para`);
request('https://rastrojs.herokuapp.com/track/'+codigoObj+'/json',{json:true},function(err,res,body){
    if(body.code == 200){
    msg.channel.send(`:star: **|** ${msg.author}, as atualizações da encomenda foram enviadas no seu privado.`).then(m=>{
    enviar(codigoObj);
    });
 }else{
     return msg.channel.send(`:face_palm: **|** ${msg.author}, objeto inexistente ou código inválido.`);
    }
});


};

exports.conf = {
  aliases: ['entrega'],
};

exports.ajuda = {
  nome : "rastrear",
  desc : "Rastrear uma entrega"
};