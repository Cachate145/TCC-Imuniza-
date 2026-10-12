        // Botão Voltar (setinha)
        document.getElementById('back-btn').addEventListener('click', function() {
            window.history.back();
        });

        // Funcionalidade de Acordeão para as Dúvidas Comuns
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                
                // Fecha os outros itens abertos (opcional, deixa a interface mais limpa)
                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Alterna o estado atual
                item.classList.toggle('active');
            });
        });

        // Botão Falar com Suporte (envio de e-mail para o Guilherme)
        document.getElementById('support-btn').addEventListener('click', function() {
            const email = 'guilhermeunderlinests@gmail.com';
            const subject = encodeURIComponent('Suporte - Primeiros Passos (Imuniza+)');
            const body = encodeURIComponent('Olá,\n\nPreciso de auxílio com os Primeiros Passos no aplicativo Imuniza+.\n\nAtenciosamente,');
            
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        });