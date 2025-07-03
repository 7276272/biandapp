/**
 * 钱包UI定制器
 * 用于动态隐藏钱包连接弹窗中的特定文字内容
 */

// 需要隐藏的文字内容列表
const textToHide = [
  "Haven't got a wallet?",
  "Get started",
  "UX by",
  "reown",
  "Powered by WalletConnect",
  "Powered by Reown",
  "Powered by",
  "WalletConnect",
  "Reown"
];

// 需要隐藏的元素选择器
const selectorsToHide = [
  // W3M Modal 选择器
  'w3m-modal *[data-testid*="footer"]',
  'w3m-modal *[data-testid*="brand"]',
  'w3m-modal *[data-testid*="powered"]',
  'w3m-modal *[data-testid*="reown"]',
  'w3m-modal *[data-testid*="get-started"]',
  'w3m-modal *[data-testid*="help"]',
  'w3m-modal *[data-testid*="legal"]',
  'w3m-modal *[data-testid*="info"]',
  'w3m-modal .w3m-modal-footer',
  'w3m-modal .w3m-info-footer',
  'w3m-modal .w3m-legal-footer',
  'w3m-modal .w3m-footer',
  'w3m-modal .w3m-help-footer',
  'w3m-modal .w3m-wallet-get-started',
  'w3m-modal .w3m-get-started',
  'w3m-modal .w3m-qr-code-footer',
  'w3m-modal .w3m-brand-footer',
  'w3m-modal .w3m-brand-logo',
  'w3m-modal .w3m-powered-by',
  'w3m-modal .w3m-reown-logo',
  'w3m-modal .w3m-wallet-connect-logo',
  'w3m-modal a[href*="reown"]',
  'w3m-modal a[href*="walletconnect"]',
  'w3m-modal a[href*="cloud.reown"]',
  'w3m-modal a[href*="cloud.walletconnect"]',
  
  // AppKit Modal 选择器
  'appkit-modal *[data-testid*="footer"]',
  'appkit-modal *[data-testid*="brand"]',
  'appkit-modal *[data-testid*="powered"]',
  'appkit-modal *[data-testid*="reown"]',
  'appkit-modal *[data-testid*="get-started"]',
  'appkit-modal .appkit-modal-footer',
  'appkit-modal .appkit-info-footer',
  'appkit-modal .appkit-legal-footer',
  'appkit-modal .appkit-brand-footer',
  'appkit-modal .appkit-powered-by',
  'appkit-modal .appkit-get-started',
  'appkit-modal a[href*="reown"]',
  'appkit-modal a[href*="walletconnect"]',
  
  // 通用选择器
  '[data-testid*="footer"]',
  '[data-testid*="brand"]',
  '[data-testid*="powered"]',
  '[data-testid*="reown"]',
  '[data-testid*="get-started"]',
  '[data-testid*="help"]',
  '[data-testid*="legal"]',
  '[data-testid*="info"]'
];

// 隐藏元素的函数
function hideElement(element: Element) {
  if (element instanceof HTMLElement) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.height = '0';
    element.style.margin = '0';
    element.style.padding = '0';
    element.style.border = 'none';
    element.style.overflow = 'hidden';
  }
}

// 检查文本内容并隐藏包含特定文字的元素
function hideElementsWithText() {
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    const textContent = element.textContent?.toLowerCase() || '';
    
    // 检查是否包含需要隐藏的文字
    const shouldHide = textToHide.some(text => 
      textContent.includes(text.toLowerCase())
    );
    
    if (shouldHide) {
      hideElement(element);
    }
  });
}

// 通过选择器隐藏元素
function hideElementsBySelector() {
  selectorsToHide.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        hideElement(element);
      });
    } catch (error) {
      // 忽略选择器错误
      console.debug('Selector error:', selector, error);
    }
  });
}

// 主要的隐藏函数
function hideWalletUIElements() {
  hideElementsBySelector();
  hideElementsWithText();
}

// 创建观察器来监听DOM变化
function createObserver() {
  const observer = new MutationObserver((mutations) => {
    let shouldHide = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // 检查是否是钱包相关的元素
            if (element.tagName?.toLowerCase().includes('w3m') || 
                element.tagName?.toLowerCase().includes('appkit') ||
                element.getAttribute('data-testid')?.includes('w3m') ||
                element.getAttribute('data-testid')?.includes('appkit') ||
                element.className?.includes('w3m') ||
                element.className?.includes('appkit')) {
              shouldHide = true;
            }
            
            // 检查子元素
            if (element.querySelectorAll) {
              const walletElements = element.querySelectorAll('*[class*="w3m"], *[class*="appkit"], *[data-testid*="w3m"], *[data-testid*="appkit"]');
              if (walletElements.length > 0) {
                shouldHide = true;
              }
            }
          }
        });
      }
    });
    
    if (shouldHide) {
      // 延迟执行以确保DOM完全加载
      setTimeout(() => {
        hideWalletUIElements();
      }, 100);
    }
  });
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// 初始化函数
export function initWalletUICustomizer() {
  // 立即隐藏已存在的元素
  hideWalletUIElements();
  
  // 创建观察器监听新添加的元素
  const observer = createObserver();
  
  // 定期检查并隐藏元素
  const interval = setInterval(() => {
    hideWalletUIElements();
  }, 1000);
  
  // 返回清理函数
  return () => {
    observer.disconnect();
    clearInterval(interval);
  };
}

// 在页面加载完成后自动初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletUICustomizer);
  } else {
    initWalletUICustomizer();
  }
} 