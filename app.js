const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const MetaProvider = require('@bot-whatsapp/provider/meta')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

function log(numero,mensaje,msg_bot,accion,opcion){
  const url = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/mensajes-chatbot';
  const headerslog = new Headers();
  headerslog.append('NUMERO', numero);
  headerslog.append('MENSAJE', mensaje);
  headerslog.append('MSG_BOT', msg_bot);
  headerslog.append('ACCION', accion);
  headerslog.append('OPCION', opcion);
  
  fetch(url, {
    method: 'POST', // Cambia a 'GET' si necesitas una solicitud GET
    headers: headerslog,
    body: JSON.stringify({}),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Opcion 1
const RespuestaNO= addKeyword(['NO, GRACIAS', ]).addAnswer(['Que tengas un excelente dia'],  {capture:true})

const RespuestaNO1= addKeyword(['NO, GRACIAS', ]).addAnswer(['Que tengas un excelente dia'])
const NumeroCliente = addKeyword(['ya no gracias xd xd',  ]).addAnswer(
    [
        'Por favor ingresa tu Rfc',   
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{

      log(ctx.from,ctx.body,'Por favor ingresa tu Rfc','CONSULTA DEL NUMERO DEL CLIENTE','1')

        const RFC =String(ctx.body).toUpperCase();  
        const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/RFC';
        // Configurar los headers
        const headers = new Headers();
        headers.append('RFC', RFC);
        // Configurar la solicitud
        const requestOptions = {
          method: 'GET',
          headers: headers,
        };
        // Hacer la solicitud
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => { 
       if(data.items.length==0){
        flowDynamic([{body:'No se encontraron datos del RFC *'+ ctx.body+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,)
        //log(ctx.from,ctx.body,'No se encontraron datos del RFC *'+ ctx.body+'*','CONSULTA DEL NUMERO DEL CLIENTE','1')

      }else{ 
        flowDynamic([{body:'Tu numero de cliente es *'+data.items[0].cliente_id+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,)
        //log(ctx.from,ctx.body,'Tu numero de cliente es *'+data.items[0].cliente_id+'*','CONSULTA DEL NUMERO DEL CLIENTE','1')      
      
      }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'Formato no valido,¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
         //   log(ctx.from,ctx.body,'Formato no valido','CONSULTA DEL NUMERO DEL CLIENTE','1')   
          }
          });
        }), [RespuestaNO]
)




//Opcion 2

const InformacionContrato = addKeyword(['1']).addAnswer(
    [
        'Ingresa tu numero de Cliente', 
    ],
{capture:true},
       
((ctx,{flowDynamic,fallBack}) =>{

 
    log(ctx.from,ctx.body,'Ingresa tu numero de Cliente','CONSULTA INFORMACION DE TUS CONTRATOS','2')

    const CLIENTE_ID =parseInt(ctx.body, 10);  
    const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/Ficha_Pago_w';
    // Configurar los headers
    const headers = new Headers();
    headers.append('CLIENTE_ID', CLIENTE_ID);
    // Configurar la solicitud
    const requestOptions = {
      method: 'GET',
      headers: headers,
    };
    // Hacer la solicitud
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
   if(data.items.length==0){
    flowDynamic([{body:'No se encontraron datos del numero de cliente *'+ ctx.body+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}])
    //log(ctx.from,ctx.body,'No se encontraron datos del numero de cliente *'+ ctx.body+'*','CONSULTA INFORMACION DE TUS CONTRATOS','2')
  }else{ 

//console.log(data.items[0]);
    for(i=0;i<data.items.length;i++){
      
       
       flowDynamic([{body: 'Contrato : *'+data.items[i]['numero de contrato']+'* Saldo *'+data.items[i].suma.split(/\s+/).join('')+
       '* \nTermino Vigencia: *'+data.items[i].vigencia_final.split(/\s+/).join(' ')+
       '*  \nRenovación: *'+data.items[i].vigencia_inicial.split(/\s+/).join(' ')+'*' }])

   
       if (i === data.items.length - 1) {
        setTimeout(() => {
            flowDynamic([{body:'¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}]) 
          //  log(ctx.from,ctx.body,'Se le dio correctamente la informacion','CONSULTA INFORMACION DE TUS CONTRATOS','2')
        }, 3000);
      
    } else {
    }
    }
}
      })
      .catch(error => {
      console.log(error)
      if(error.name='SyntaxError'){
        flowDynamic([{body:'Formato no valido,¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}])
        //log(ctx.from,ctx.body,'Formato no valido','CONSULTA INFORMACION DE TUS CONTRATOS','2')
      }
      });
}),
    [RespuestaNO]
)


//Opcion 3
const RespuestaSaldo = addKeyword(['saldo', 'siguiente']).addAnswer(['En este momento tu saldo actual es de :'])
const SaldoContrato = addKeyword(['2']).addAnswer(
    [
        'Por favor Ingresa tu numero de contrato',
    ],
    {capture:true},
    ((ctx,{flowDynamic,fallBack}) =>{
      log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contrato','CONSULTAR EL SALDO DE TU CONTRATO','3')
     
        const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
        const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1//Ficha_Pago_Numero_Contrato';
        // Configurar los headers
        const headers = new Headers();
        headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
        // Configurar la solicitud
        const requestOptions = {
          method: 'GET',
          headers: headers,
        };
        // Hacer la solicitud
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
           console.log(data.items[0])
       if(data.items.length==0){
        flowDynamic([{body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
        //log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contrato','No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?','CONSULTAR EL SALDO DE TU CONTRATO','3') 
      }else{ 
        flowDynamic([{body:'El saldo actual del contrato *'+NUMERO_CONTRATO+'* es de *'+data.items[0].suma.split(/\s+/).join('')+'*, ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
      //  log(ctx.from,ctx.body,'El saldo actual del contrato *'+NUMERO_CONTRATO+'* es de *'+data.items[0].suma.split(/\s+/).join('')+'*','CONSULTAR EL SALDO DE TU CONTRATO','3')    
      }

          })
          .catch(error => {
          console.log(error.name)
          if(error.name='SyntaxError'){
            flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
           // log(ctx.from,ctx.body,'No se encontraron datos del contrato '+NUMERO_CONTRATO+'','CONSULTAR EL SALDO DE TU CONTRATO','3')    
          }
          });
        }), 
    [RespuestaNO]
)


//Opcion 4
const pagar = addKeyword(['pagar', 'siguiente']).addAnswer(['ficha'])
const PagarContrato = addKeyword(['3']).addAnswer(
    ['Por favor ingresa el numero de tu contrato'],
    {capture:true
      },
    ((ctx,{flowDynamic,fallBack}) =>{
      log(ctx.from,ctx.body,'Por favor ingresa el numero de tu contrato','VISUALIZAR LA FICHA DE PAGO','4')  
      


      var today = new Date();
      var day = today.getDate();
      console.log(day)
if (day >5 ){
  const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
  const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1//Ficha_Pago_Numero_Contrato';
  
  // Configurar los headers
  const headers = new Headers();
  headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
  
  // Configurar la solicitud
  const requestOptions = {
    method: 'GET',
    headers: headers,
  };
  
  // Hacer la solicitud
  fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      //console.log(data.items[0].cliente_id)
 if(data.items.length==0){
  flowDynamic([{
   body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
   //log(ctx.from,ctx.body,'No se encontraron datos del contrato '+ NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  
      
  }else{ 
    //log(ctx.from,ctx.body,'Se le dio correctamente la informacion del '+ NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  

    function obtenerFechaHoraActual() {
      let ahora = new Date();
      let opciones = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // Asegura que el formato es de 12 horas
          timeZone: 'America/Mexico_City' // Ajusta esta línea a tu zona horaria local si es diferente
      };
      // Formatear la fecha y hora en cadena
      let fechaHora = ahora.toLocaleString('es-ES', opciones);
      
      // Ajustar AM/PM a minúsculas
      fechaHora = fechaHora.replace("a. m.", "am").replace("p. m.", "pm");
      
      return fechaHora;
  }

  flowDynamic([{body:'El saldo actual de tu contrato *'+NUMERO_CONTRATO+'* locales ('+ data.items[0].locales +') es *'+data.items[0].suma.split(/\s+/).join('')+'*. \n'
  + '*Razon social:* ' +data.items[0].razon_social +' \n\n '
  + 'Para realizar tu pago por *transferencia* \n'
  +'*Banco:* ' + data.items[0].banco.split(/\s+/).join('')+' \n'
  +'*Concepto :* ' + data.items[0].referencia_bancaria+' \n'
  +'*Clabe interbancaria :* ' + data.items[0]['clave interbancaria']+' \n'
  +'*Clave servicio:* '+data.items[0]['clave de servicio'] + ' ó 000'+data.items[0]['clave de servicio']+' \n\n'
 
  + 'Para realizar tu pago por *ventanilla* \n'
  +'*Banco:* ' + data.items[0].banco.split(/\s+/).join('')+' \n'
  +'*Referencia bancaria:* ' + data.items[0].ref+' \n'
  +'*Clave servicio:* ' + data.items[0]['clave de servicio']+' \n \n'

 
  +'*Cantidad a pagar :* ' + data.items[0].saldo.split(/\s+/).join('')+' \n'
  +'*Complementos de renovación :* ' + data.items[0].total.split(/\s+/).join('')+' \n'
  +'*Total :* ' + data.items[0].suma.split(/\s+/).join('')+  ' \n'

  + 'Esta consulta de saldo es hasta el dia ' + obtenerFechaHoraActual() + ' \n \n'

  +'¿Algo mas en lo que te podemos ayudar?'
   ,buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]
  
  }],null,null,[RespuestaNO])}})
    .catch(error => {
    console.log(error.name)
    if(error.name='SyntaxError'){
      flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?',  buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
    
      //log(ctx.from,ctx.body,'No se encontraron datos del contrato '+NUMERO_CONTRATO+'','VISUALIZAR LA FICHA DE PAGO','4')  
    }
    });

}else{
  flowDynamic([{body:'⚠️ Te recordamos que la información de tu(s) contrato(s) estará disponible para consulta a partir del día 6 de cada mes. ¡Gracias por tu comprensión!',  buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])

}


       
        }), 
    [RespuestaNO]
)

//OPCION 5 
const contactoplaza = addKeyword(['4']).addAnswer(
  [
      'Por favor Ingresa tu numero de contrato',
  ],
  {capture:true},
  ((ctx,{flowDynamic,fallBack}) =>{
    log(ctx.from,ctx.body,'Por favor Ingresa tu numero de contratos','HABLAR CON UN ASESOR','5')  
    

      const NUMERO_CONTRATO =String(ctx.body).toUpperCase();  
      const apiUrl = 'https://nuevo.apexdeape.com.mx/ords/apeppdb1/xxschema_contratos/ar1/v1/contacto_plaza';
      // Configurar los headers
      const headers = new Headers();
      headers.append('NUMERO_CONTRATO', NUMERO_CONTRATO);
      // Configurar la solicitud
      const requestOptions = {
        method: 'GET',
        headers: headers,
      };
      // Hacer la solicitud
      fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
         console.log(data.items[0])
     if(data.items.length==0){
      flowDynamic([{body:'No se encontraron datos del contrato *'+ NUMERO_CONTRATO+'* . Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' } ]}],null,null,[RespuestaNO])
      //log(ctx.from,ctx.body,'No se encontraron datos del contrato','HABLAR CON UN ASESOR','5')  
    
    
    }else{ 
      flowDynamic([{body:'Para aclacion de dudas comunicate con ADMNISTRACIÓN DE LA PLAZA al numero '+data.items[0].numero_telefono+' o un correo a la siguiente direccion *'+data.items[0].correo +'*, en un horario de 10:00 horas a las 20:00 horas ¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR' }, { body: 'NO, GRACIAS' }]}],null,null,[RespuestaNO])
      //log(ctx.from,ctx.body,'Para aclacion de dudas comunicate con '+data.items[0].nombre+' al numero '+data.items[0].numero_telefono+' o un correo a la siguiente direccion '+data.items[0].correo +'','HABLAR CON UN ASESOR','5')        
    }

        })
        .catch(error => {
        console.log(error.name)
        if(error.name='SyntaxError'){
          flowDynamic([{body:'No se encontraron datos del contrato '+NUMERO_CONTRATO+',¿Algo mas en lo que podemos ayudarte?', buttons: [{ body: 'SI, POR FAVOR',  }, { body: 'NO, GRACIAS' } ],}],null,null,[RespuestaNO])
         // log(ctx.from,ctx.body,'No se encontraron datos del contrato ','HABLAR CON UN ASESOR','5')        
  
        }
        });
      }), 
  [RespuestaNO]
)


const flowPrincipal = addKeyword(['^(?!NO, GRACIAS$).*'])
   
    .addAnswer(
        [
            '¡Buen día! Aquí tienes nuestro menú de opciones, Envía el número de la opción que deseas consultar. ',
            '👉 *1* Consulta la informacion de tus contratos',
            '👉 *2* Consultar el Saldo de tu contrato',
            '👉 *3* Pagar contrato',
            '👉 *4* Hablar con un asesor',
            
        ],{capture:true},
      null 
      ,
        [NumeroCliente, InformacionContrato, SaldoContrato, PagarContrato,contactoplaza,RespuestaNO]
    ) 

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal,RespuestaNO])
 
    
    //Produccion
    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAVZCOTzwHAcBO5LjxXJhaQhTiUL3mT56wJo5vsYAmVrgpyeXDC2ooicdJH8iZBGhHU7pHj5Jzg5pqOr3UuEsZCxAyHoxJ65T7ATn4u4SH8akYvowOphVJhTKuHZBN5JPX0rHpWnr9qpnLgNoMYGkPCDn2NNHNkhqDMxJ9rTEtlQQceHDxHvZCfCpLrVL',
        numberId: '119447597909937',
        verifyToken: 'LO_QUE_SEA',
        version: 'v17.0',
    })

 /*
    const adapterProvider = createProvider(MetaProvider, {
      jwtToken: 'EAAMtNDakSugBO1U60ufPPuTRS5XJgrlXEy5sZAVWXmkZCgkKu6UxeKHof6YZCHGHXWmxZCZCoq07K2clXIIIoAsoNVLutWS5JodBr6wvQF5NZAdrlH0OtxwCZCd5SlKeNNVGI45U84FZBzmeswezKl2VsaRetefLVF8i2Ork0ZAg7AkbGG5t69sRZBGldacgyEZAZCzbiHSueahY54a1916enzVHZByTdhvNZBbDzMD5lZCXgB65i0ZD',
      numberId: '102089836052786',
      verifyToken: 'LO_QUE_SEA',
      version: 'v19.0',
    })

    */



    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}
main()

 
