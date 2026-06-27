import { CONFIG } from '../config.js';

export function initCalculator(): void {
  const customDetailsWrapper = document.getElementById('custom-details-wrapper');
  if (!customDetailsWrapper) return; 

  const setupRadioGroups = (containerId: string): void => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const options = container.querySelectorAll('.calc-option');
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input[type="radio"]') as HTMLInputElement | null;
        if (input) {
          input.checked = true;
          input.dispatchEvent(new Event('change'));
        }
      });
    });
  };

  setupRadioGroups('mat-options');
  setupRadioGroups('room-options');

  const matOptions = document.querySelectorAll<HTMLInputElement>('input[name="material"]');
  matOptions.forEach(opt => {
    opt.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value === 'Projeto Personalizado / Especial') {
        customDetailsWrapper.style.display = 'block';
      } else {
        customDetailsWrapper.style.display = 'none';
      }
    });
  });

  const slider = document.getElementById('size-slider') as HTMLInputElement | null;
  const sizeDisplay = document.getElementById('size-display');
  const sizeUnknown = document.getElementById('size-unknown') as HTMLInputElement | null;
  const sizeWrapper = document.getElementById('size-wrapper');
  
  if (slider && sizeDisplay) {
    slider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      sizeDisplay.textContent = target.value;
      if (sizeUnknown && sizeWrapper) {
        sizeUnknown.checked = false;
        sizeWrapper.style.opacity = '1';
        sizeWrapper.style.pointerEvents = 'auto';
      }
    });
  }

  if (sizeUnknown && sizeWrapper) {
    sizeUnknown.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if(target.checked) {
        sizeWrapper.style.opacity = '0.4';
        sizeWrapper.style.pointerEvents = 'none'; 
      } else {
        sizeWrapper.style.opacity = '1';
        sizeWrapper.style.pointerEvents = 'auto';
      }
    });
  }

  const btnSend = document.getElementById('btn-send-whatsapp');
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const materialEl = document.querySelector<HTMLInputElement>('input[name="material"]:checked');
      const roomEl = document.querySelector<HTMLInputElement>('input[name="room"]:checked');
      const customDetailsInput = document.getElementById('custom-details-input') as HTMLInputElement | null;
      const isSizeUnknown = sizeUnknown ? sizeUnknown.checked : false;

      const material = materialEl ? materialEl.value : 'Não definido';
      const room = roomEl ? roomEl.value : 'Ainda não definido';
      const size = isSizeUnknown ? 'Ainda não sei medir' : (slider ? `${slider.value} m²` : 'Não definido');

      let materialText = material;
      const isCustom = materialEl && materialEl.value === 'Projeto Personalizado / Especial';
      if (isCustom && customDetailsInput && customDetailsInput.value.trim() !== '') {
        materialText += `\n- *Ideia/Detalhes do projeto:* ${customDetailsInput.value.trim()}`;
      }

      const message = `${CONFIG.whatsappGreeting}

*Detalhes do meu projeto:*
- *Acabamento:* ${materialText}
- *Ambiente:* ${room}
- *Tamanho:* ${size}

Poderiam me passar uma estimativa de valor ou agendar uma visita?`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
      
      window.open(waUrl, '_blank');
    });
  }
}
