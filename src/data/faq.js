// src/data/faq.js
// Preguntas frecuentes del chatbot.
// IMPORTANTE: son textos de ejemplo. Reemplazalos por los datos reales de tu negocio.
// Para agregar una pregunta, copiá un bloque { ... }. Con accion: 'chat' la respuesta
// muestra un botón que lleva a la pestaña de chat.

export const SALUDO =
    '¡Hola! Soy el asistente de MotorHub. Elegí una pregunta y te respondo al instante.'

export const PREGUNTAS = [
    {
        id: 'horarios',
        pregunta: '¿Cuáles son los horarios de atención?',
        respuesta:
            'Atendemos de lunes a viernes de 9 a 18 h y los sábados de 9 a 13 h.'
    },
    {
        id: 'ubicacion',
        pregunta: '¿Dónde están ubicados?',
        respuesta:
            'Podés visitarnos en nuestro local. Escribinos por el chat y te pasamos la dirección exacta y cómo llegar.'
    },
    {
        id: 'pagos',
        pregunta: '¿Qué medios de pago aceptan?',
        respuesta:
            'Aceptamos efectivo, transferencia bancaria y tarjetas. Consultanos por el chat para ver las opciones disponibles según el vehículo.'
    },
    {
        id: 'financiacion',
        pregunta: '¿Tienen financiación?',
        respuesta:
            'Sí, trabajamos con planes de financiación. Las cuotas y requisitos dependen del vehículo y de tu perfil; escribinos y te pasamos una simulación.'
    },
    {
        id: 'permuta',
        pregunta: '¿Reciben mi vehículo usado como parte de pago?',
        respuesta:
            'Evaluamos permutas. Contanos marca, modelo, año y kilometraje de tu vehículo y te damos una cotización.'
    },
    {
        id: 'prueba',
        pregunta: '¿Puedo probar el vehículo antes de comprarlo?',
        respuesta:
            'Sí, coordinamos una prueba de manejo. Necesitás presentar tu documento y tu licencia de conducir vigente.'
    },
    {
        id: 'documentacion',
        pregunta: '¿Qué documentación necesito para comprar?',
        respuesta:
            'Tu documento de identidad y un comprobante de domicilio. Si pagás con financiación, pueden pedirte comprobantes de ingresos.'
    },
    {
        id: 'reserva',
        pregunta: '¿Puedo reservar un vehículo?',
        respuesta:
            'Sí, podés reservarlo con una seña. Si el stock figura en cero en la página, escribinos y te avisamos cuando ingrese.'
    },
    {
        id: 'garantia',
        pregunta: '¿Los vehículos tienen garantía?',
        respuesta:
            'Los vehículos 0 km cuentan con la garantía oficial de fábrica. Para los usados, consultanos las condiciones de cada unidad.'
    },
    {
        id: 'persona',
        pregunta: 'Quiero hablar con una persona',
        respuesta:
            'Perfecto. Desde la pestaña Chat podés escribirnos directamente; necesitás tener sesión iniciada.',
        accion: 'chat'
    }
]
