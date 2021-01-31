import { PromptProps } from 'components/common/popups';

import { getRandomId, EventEmitter } from './general';

class PromptManager extends EventEmitter<PromptProps> {
  confirm(prompt: PromptProps) {
    this.emit('change', {
      id: getRandomId(),
      type: 'confirm',
      heading: 'Please confirm',
      ...prompt,
    });
  }
}

export const prompt = new PromptManager();
