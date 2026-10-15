        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const typingIndicator = document.getElementById('typing-indicator');

        document.getElementById('back-btn').addEventListener('click', function() {
            window.history.back();
        });

        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Base de Conhecimento do FAQ
        const faqKnowledgeBase = [
            {
                keywords: ["o que e imuniza", "para que serve", "o que e esse site", "sobre a plataforma", "como funciona"],
                answer: "O **Imuniza+** é um protótipo de plataforma web criado para facilitar a gestão da carteira de vacinação no Brasil. Com ele você pode acompanhar doses pendentes, agendar vacinas, cadastrar dependentes e localizar postos de saúde."
            },
            {
                keywords: ["gratuito", "pago", "quanto custa", "tem que pagar", "valor"],
                answer: "Sim! O uso do Imuniza+ é totalmente **gratuito**."
            },
            {
                keywords: ["aplicativo", "app", "baixar", "play store", "app store", "instalacao", "navegador"],
                answer: "Você não precisa baixar nada! O Imuniza+ funciona direto pelo **navegador web** do seu celular, computador ou tablet."
            },
            {
                keywords: ["oficial", "sus", "governo", "conecte sus", "ministerio da saude"],
                answer: "Atualmente, o Imuniza+ é um **protótipo independente** e não possui integração oficial com o SUS ou Governo. Os dados ficam salvos localmente no seu navegador."
            },
            {
                keywords: ["criar conta", "fazer login", "cadastro", "entrar", "cadastrar", "cpf"],
                answer: "Como o sistema armazena os dados localmente no navegador (*localStorage*), a tela de cadastro e login real ainda está em desenvolvimento para futuras atualizações."
            },
            {
                keywords: ["esqueci a senha", "mudar senha", "recuperar senha", "esqueci senha"],
                answer: "A funcionalidade de recuperação de senha será implementada em futuras versões com banco de dados real (*backend*)."
            },
            {
                keywords: ["dependente", "adicionar filho", "perfis familiares", "cadastrar familia", "parentesco", "conjuge"],
                answer: "Para adicionar um familiar, acesse a aba **Perfis Familiares**, clique em 'Adicionar Perfil' e preencha as informações. Assim você poderá gerenciar a carteira do seu dependente separadamente."
            },
            {
                keywords: ["carteira", "minhas vacinas", "onde vejo vacinas", "doses", "historico", "ver vacinas"],
                answer: "Você pode visualizar todas as suas vacinas aplicadas e pendentes na aba **Carteira Completa** ou pelo seu **Dashboard**."
            },
            {
                keywords: ["agendar vacina", "como agendo", "marcar vacinacao", "marcar vacina", "agendamento"],
                answer: "Para agendar uma vacina, utilize o menu **Agendar Vacinação**. Escolha a vacina, selecione o perfil (você ou dependente) e escolha o posto de saúde mais próximo. Ao final, você pode baixar o comprovante em PDF."
            },
            {
                keywords: ["cancelar agendamento", "reagendar", "mudar data"],
                answer: "Você pode gerenciar ou cancelar seus agendamentos através da tela de histórico de agendamentos no seu painel."
            },
            {
                keywords: ["postos de saude", "posto proximo", "rota", "google maps", "mapa", "unidade de saude"],
                answer: "Na aba **Postos de Saúde**, você encontra as unidades de atendimento mais próximas e pode traçar a rota exata usando o **Google Maps**."
            },
            {
                keywords: ["comprovante", "imprimir", "pdf", "download", "baixar comprovante"],
                answer: "Sim! Após agendar a vacina, o Imuniza+ gera um **Comprovante de Agendamento** pronto para impressão ou download em formato PDF."
            },
            {
                keywords: ["segurança", "privacidade", "lgpd", "meus dados", "seguros", "dados salvos"],
                answer: "Seus dados de saúde ficam protegidos e são salvos localmente no navegador do seu dispositivo (*localStorage*), respeitando as diretrizes de privacidade e LGPD."
            },
            {
                keywords: ["troquei de celular", "mudei de computador", "dados sumiram", "perdi dados"],
                answer: "Como os dados ficam salvos localmente no navegador atual (*localStorage*), ao trocar de aparelho ou limpar os dados do navegador, as informações não são sincronizadas automaticamente."
            },
            {
                keywords: ["ajuda", "suporte", "falar com atendente", "contato", "central de ajuda"],
                answer: "Você pode acessar a **Central de Ajuda** no menu do aplicativo ou clicar no botão de suporte para enviar um e-mail direto à nossa equipe técnica!"
            }
        ];

        // Algoritmo de Similaridade de Texto (Fuzzy Matching)
        function getBigrams(string) {
            const s = string.toLowerCase().replace(/[^\w\s]/gi, '');
            const bigrams = [];
            for (let i = 0; i < s.length - 1; i++) {
                bigrams.push(s.slice(i, i + 2));
            }
            return bigrams;
        }

        function calculateSimilarity(str1, str2) {
            const clean1 = str1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const clean2 = str2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (clean1.includes(clean2) || clean2.includes(clean1)) {
                return 0.85;
            }

            const bigrams1 = getBigrams(clean1);
            const bigrams2 = getBigrams(clean2);

            if (bigrams1.length === 0 || bigrams2.length === 0) return 0;

            let intersection = 0;
            const bigrams2Copy = [...bigrams2];

            for (const bigram of bigrams1) {
                const index = bigrams2Copy.indexOf(bigram);
                if (index !== -1) {
                    intersection++;
                    bigrams2Copy.splice(index, 1);
                }
            }

            return (2 * intersection) / (bigrams1.length + bigrams2.length);
        }

        function getBestMatchingAnswer(userQuery) {
            let bestMatch = null;
            let highestScore = 0;

            faqKnowledgeBase.forEach(faq => {
                faq.keywords.forEach(keyword => {
                    const score = calculateSimilarity(userQuery, keyword);
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = faq.answer;
                    }
                });
            });

            if (highestScore < 0.28) {
                return "Desculpe, **não consegui compreender sua pergunta** ou ela está fora do contexto do **Imuniza+**.\n\nTente me perguntar sobre:\n- Como agendar vacinas\n- Onde ver sua carteira completa\n- Adicionar perfis familiares\n- Encontrar postos de saúde próximos";
            }

            return bestMatch;
        }

        function addMessage(text, sender) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('message-wrapper', sender);
            
            const avatar = document.createElement('div');
            avatar.classList.add('message-avatar');
            avatar.innerHTML = sender === 'bot' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

            const content = document.createElement('div');
            content.classList.add('message-content');
            
            const formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            
            content.innerHTML = `
                ${formattedText}
                <span class="message-time">${getCurrentTime()}</span>
            `;

            wrapper.appendChild(avatar);
            wrapper.appendChild(content);

            chatMessages.insertBefore(wrapper, typingIndicator);
            scrollToBottom();
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleUserMessage() {
            const text = userInput.value.trim();
            if (text === '') return;

            addMessage(text, 'user');
            userInput.value = '';

            typingIndicator.style.display = 'flex';
            scrollToBottom();

            setTimeout(() => {
                typingIndicator.style.display = 'none';
                const botResponse = getBestMatchingAnswer(text);
                addMessage(botResponse, 'bot');
            }, 700);
        }

        sendBtn.addEventListener('click', handleUserMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });

        window.sendSuggestion = function(suggestionText) {
            userInput.value = suggestionText;
            handleUserMessage();
        };