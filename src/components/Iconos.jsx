// Íconos simples dibujados con SVG (no hace falta instalar nada)

const DIBUJOS = {
    buscar: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),
    filtros: (
        <>
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
        </>
    ),
    abajo: <path d="m6 9 6 6 6-6" />,
    izquierda: <path d="m15 6-6 6 6 6" />,
    derecha: <path d="m9 6 6 6-6 6" />,
    cerrar: <path d="M6 6l12 12M18 6 6 18" />,
    zoom: (
        <>
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.5-4.5M11 8.5v5M8.5 11h5" />
        </>
    ),
    check: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
        </>
    ),
    etiqueta: (
        <>
            <path d="M3 12V4h8l10 10-8 8z" />
            <circle cx="7.5" cy="8.5" r="1.2" />
        </>
    ),
    marca: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />,
    modelo: (
        <>
            <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    anio: (
        <>
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M4 10h16M9 3v4M15 3v4" />
        </>
    ),
    km: (
        <>
            <path d="M4 17a8 8 0 1 1 16 0" />
            <path d="m12 17 4-5" />
        </>
    ),
    cilindrada: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </>
    ),
    tipo: (
        <>
            <circle cx="6" cy="17" r="3" />
            <circle cx="18" cy="17" r="3" />
            <path d="M6 17 9 9h5l4 8M9 9 7 6h3" />
        </>
    ),
    moto: (
        <>
            <circle cx="5.5" cy="16.5" r="3.5" />
            <circle cx="18.5" cy="16.5" r="3.5" />
            <path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 7.5 6H5M13 9l-1-3h3" />
        </>
    ),
    whatsapp: (
        <>
            <path d="M4 20l1.3-4A8 8 0 1 1 8 18.8z" />
            <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" />
        </>
    ),
    corazon: (
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    ),
    camion: (
        <>
            <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
            <circle cx="7" cy="17.5" r="1.8" />
            <circle cx="17" cy="17.5" r="1.8" />
        </>
    ),
    documento: (
        <>
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v4h4M10 13h5M10 17h5" />
        </>
    ),
    panel: (
        <>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </>
    ),
    salir: (
        <>
            <path d="M9 4H5v16h4" />
            <path d="m16 8 4 4-4 4M20 12H9" />
        </>
    ),
    chat: (
        <>
            <path d="M4 5h16v11H10l-6 4z" />
            <path d="M8.5 10h7" />
        </>
    ),
    enviar: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
    persona: (
        <>
            <circle cx="12" cy="9" r="4" />
            <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
        </>
    ),
}

function Icono({ nombre, tamano = 16, className = '' }) {
    return (
        <svg
            className={className}
            width={tamano}
            height={tamano}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {DIBUJOS[nombre]}
        </svg>
    )
}

export default Icono
