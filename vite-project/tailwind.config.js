/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                // Animaciones por ANIME
                'goh-power': 'gohPower 2s ease-in-out infinite',
                'naruto-chakra': 'narutoChakra 3s ease-in-out infinite',
                'jujutsu-curse': 'jujutsuCurse 2.5s ease-in-out infinite',
                'db-aura': 'dbAura 4s ease-in-out infinite',
                'sl-shadow': 'slShadow 5s ease-in-out infinite',

                // Animaciones por RAREZA MEJORADAS
                'rareza-ss': 'rarezaSS 1.5s ease-in-out infinite',
                'rareza-s': 'rarezaS 2s ease-in-out infinite',
                'rareza-a': 'rarezaA 2.5s ease-in-out infinite',
                'rareza-b': 'rarezaB 3s ease-in-out infinite',
                'glow-ss': 'glowSS 1.5s ease-in-out infinite',
                'glow-s': 'glowS 2s ease-in-out infinite',
                'shine-ss': 'shineSS 2s linear infinite',
                'shine-s': 'shineS 3s linear infinite',
                'pulse-gold': 'pulseGold 2s ease-in-out infinite',
                'pulse-silver': 'pulseSilver 2.5s ease-in-out infinite',
                'float-ss': 'floatSS 4s ease-in-out infinite',
                'spin-ss': 'spinSS 10s linear infinite',

                // Animaciones generales
                'float-slow': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'border-glow': 'borderGlow 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                // Animaciones por ANIME
                gohPower: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 10px #dc2626, inset 0 0 10px rgba(220, 38, 38, 0.3)'
                    },
                    '50%': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 20px #dc2626, inset 0 0 15px rgba(220, 38, 38, 0.5)'
                    },
                },
                narutoChakra: {
                    '0%, 100%': {
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)'
                    },
                    '50%': {
                        borderColor: 'rgba(59, 130, 246, 1)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.2)'
                    },
                },
                jujutsuCurse: {
                    '0%, 100%': {
                        filter: 'brightness(1) drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))'
                    },
                    '50%': {
                        filter: 'brightness(1.1) drop-shadow(0 0 15px rgba(168, 85, 247, 0.7))'
                    },
                },
                dbAura: {
                    '0%, 100%': {
                        boxShadow: '0 0 15px rgba(234, 179, 8, 0.4), 0 0 30px rgba(234, 179, 8, 0.1)'
                    },
                    '50%': {
                        boxShadow: '0 0 25px rgba(234, 179, 8, 0.8), 0 0 50px rgba(234, 179, 8, 0.2)'
                    },
                },
                slShadow: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(147, 51, 234, 0.2)'
                    },
                    '50%': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.4)'
                    },
                },

                // Animaciones por RAREZA MEJORADAS
                rarezaSS: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.2)',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.4)',
                        transform: 'scale(1.01)'
                    },
                },
                rarezaS: {
                    '0%, 100%': {
                        boxShadow: '0 0 15px rgba(192, 192, 192, 0.6)',
                        borderColor: 'rgba(192, 192, 192, 0.8)'
                    },
                    '50%': {
                        boxShadow: '0 0 25px rgba(192, 192, 192, 0.9)',
                        borderColor: 'rgba(192, 192, 192, 1)'
                    },
                },
                rarezaA: {
                    '0%, 100%': {
                        boxShadow: '0 0 10px rgba(205, 127, 50, 0.5)'
                    },
                    '50%': {
                        boxShadow: '0 0 20px rgba(205, 127, 50, 0.8)'
                    },
                },
                rarezaB: {
                    '0%, 100%': {
                        filter: 'brightness(1)'
                    },
                    '50%': {
                        filter: 'brightness(1.05)'
                    },
                },
                glowSS: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 165, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.2)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 165, 0, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.3)'
                    },
                },
                glowS: {
                    '0%, 100%': {
                        boxShadow: '0 0 15px rgba(192, 192, 192, 0.5), 0 0 30px rgba(192, 192, 192, 0.2)'
                    },
                    '50%': {
                        boxShadow: '0 0 25px rgba(192, 192, 192, 0.8), 0 0 50px rgba(192, 192, 192, 0.3)'
                    },
                },
                shineSS: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                shineS: {
                    '0%': { backgroundPosition: '-300% center' },
                    '100%': { backgroundPosition: '300% center' },
                },
                pulseGold: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0.8'
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                        opacity: '1'
                    },
                },
                pulseSilver: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0.7'
                    },
                    '50%': {
                        transform: 'scale(1.03)',
                        opacity: '0.9'
                    },
                },
                floatSS: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-8px) rotate(2deg)' },
                    '66%': { transform: 'translateY(4px) rotate(-1deg)' },
                },
                spinSS: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },

                // Animaciones generales
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.8' },
                    '50%': { opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                borderGlow: {
                    '0%, 100%': { borderColor: 'rgba(255,255,255,0.3)' },
                    '50%': { borderColor: 'rgba(255,255,255,0.8)' },
                },
            },
            // Gradientes para rarezas MEJORADOS
            backgroundImage: {
                'gradient-ss': 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%)',
                'gradient-s': 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #C0C0C0 50%, #E8E8E8 75%, #C0C0C0 100%)',
                'gradient-a': 'linear-gradient(135deg, #CD7F32 0%, #B87333 25%, #CD7F32 50%, #B87333 75%, #CD7F32 100%)',
                'gradient-b': 'linear-gradient(135deg, #228B22 0%, #32CD32 25%, #228B22 50%, #32CD32 75%, #228B22 100%)',
                'gradient-c': 'linear-gradient(135deg, #808080 0%, #A9A9A9 25%, #808080 50%, #A9A9A9 75%, #808080 100%)',
                'gradient-ss-card': 'linear-gradient(145deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1), rgba(255,215,0,0.15))',
                'gradient-s-card': 'linear-gradient(145deg, rgba(192,192,192,0.12), rgba(232,232,232,0.08), rgba(192,192,192,0.12))',
            },
        },
    },
    plugins: [],
}