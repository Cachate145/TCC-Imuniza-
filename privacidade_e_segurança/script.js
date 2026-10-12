        document.getElementById('support-btn').addEventListener('click', function() {
            const email = 'guilhermeunderlinests@gmail.com';
            const subject = encodeURIComponent('Suporte de Dados - Imuniza+');
            const body = encodeURIComponent('Olá,\n\nGostaria de tirar dúvidas sobre a privacidade e segurança dos meus dados no Imuniza+.\n\nAtenciosamente,');
            
            // Abre o aplicativo/cliente de e-mail padrão do usuário
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        });