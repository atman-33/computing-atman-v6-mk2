import { ElementContent } from 'hast';
import { ShikiTransformer } from 'shiki';

interface TransformerAddCopyButtonOptions {
  toggle?: number;
}

const transformerAddCopyButton = (
  options: TransformerAddCopyButtonOptions = {},
): ShikiTransformer => {
  const toggleMs = options.toggle || 2000;

  return {
    name: 'transformer-add-copy-button',

    pre(node) {
      const button: ElementContent = {
        type: 'element',
        tagName: 'button',
        properties: {
          className: ['copy'],
          dataCode: this.source,
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['ready'] },
            children: [],
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['success'] },
            children: [],
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node.children.push(button as any);

      // ボタンを後で取得してイベントをバインドする。
      // NOTE:
      // node.children.push(button)のようなコードでノードツリーを更新すると、DOMへの反映が即座に行われるとは限らない。
      // そのため、setTimeout(0)で現在の同期タスクが完了した後、次のマイクロタスクが完了した段階で実行するように制御している。
      setTimeout(() => {
        const buttons = document.querySelectorAll('button.copy');
        // console.log('buttons: ', buttons);
        buttons.forEach((btn) => {
          console.log('btn: ', btn);
          btn.addEventListener('click', () => {
            // console.log('clicked!');
            const code = btn.getAttribute('data-code');
            if (code) {
              navigator.clipboard.writeText(code);
              btn.classList.add('copied');
              setTimeout(() => btn.classList.remove('copied'), toggleMs);
            }
          });
        });
      }, 0);
    },
  };
};

export { transformerAddCopyButton };
