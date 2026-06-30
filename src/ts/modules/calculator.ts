import { CONFIG } from '../config.js';

export function initCalculator(): void {
  const btnSend = document.getElementById('btn-send-whatsapp');
  
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const nameInput = document.getElementById('simple-name') as HTMLInputElement | null;
      const roomInput = document.getElementById('simple-room') as HTMLInputElement | null;
      const serviceSelect = document.getElementById('simple-service') as HTMLSelectElement | null;
      
      const name = nameInput?.value.trim() || 'Não informado';
      const room = roomInput?.value.trim() || 'Não informado';
      const service = serviceSelect?.value || 'Não definido';

      let greeting = CONFIG.whatsappGreeting;
      if (document.body.classList.contains('theme-saude')) {
        greeting = 'Olá, vim pela página de Saúde e preciso de um forro para minha clínica.';
      } else if (document.body.classList.contains('theme-acustica')) {
        greeting = 'Olá, vim pela página de Acústica e preciso de isolamento acústico.';
      }

      const message = `${greeting}

*Meus Dados:*
- *Nome:* ${name}
- *Ambiente:* ${room}
- *Serviço de Interesse:* ${service}

Gostaria de falar com um consultor para um orçamento!`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
      
      window.open(waUrl, '_blank');
    });
  }
}
