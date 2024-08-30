import { promises as fs } from 'fs';
import { DOMParser, HTMLElement } from 'linkedom';
import * as path from 'path';
import { Page } from 'playwright';
import { format } from 'prettier';

function cleanHtml(html: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  // Remove script and style elements
  document.querySelectorAll('script, style, link').forEach((el) => el.remove());

  // Remove comments
  const removeComments = (node: HTMLElement | HTMLBodyElement) => {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      if (child.nodeType === 8) {
        // Comment node
        node.removeChild(child);
      } else if (child.nodeType === 1) {
        // Element node
        removeComments(child as HTMLElement);
      }
    }
  };
  removeComments(document.body);

  // Keep more attributes that might be necessary for functionality
  const keepAttributes = [
    'href',
    'src',
    'id',
    'class',
    'type',
    'name',
    'aria-label',
    'aria-expanded',
    'data-track',
    'data-placeholder-text',
    'tabindex',
    'role',
  ];

  document.querySelectorAll('*').forEach((el) => {
    if (el instanceof HTMLElement) {
      Array.from(el.attributes).forEach((attr: any) => {
        if (
          !keepAttributes.includes(attr.name) &&
          !attr.name.startsWith('data-')
        ) {
          el.removeAttribute(attr.name);
        }
      });
    }
  });

  // Modify the removeEmpty function to keep more elements
  const removeEmpty = (node: HTMLElement | HTMLBodyElement) => {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i] as HTMLElement;
      if (child.nodeType === 1) {
        // Element node
        removeEmpty(child);
        if (
          child.innerHTML.trim() === '' &&
          !['br', 'hr', 'img', 'input', 'button'].includes(
            child.tagName.toLowerCase(),
          ) &&
          !child.hasAttribute('aria-label')
        ) {
          child.remove();
        }
      }
    }
  };
  removeEmpty(document.body);

  // Keep the entire body content instead of just the main content
  const cleanedHtml = `<html><head><title>${document.title}</title>${
    document.querySelector('meta[name="description"]')?.outerHTML || ''
  }</head><body>${document.body.innerHTML}</body></html>`;

  return cleanedHtml.replace(/>\s+</g, '><').trim();
}

function formatHtml(html: string) {
  return format(html, {
    parser: 'html',
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
  });
}

async function fetchAndCleanHtml(page: Page): Promise<string> {
  try {
    const html = await page.content();
    const cleanedHtml = cleanHtml(html);
    return await formatHtml(cleanedHtml);
  } catch (error) {
    console.error('Error fetching or cleaning HTML:', error);
    throw error;
  }
}

async function capturePageSnapshot(
  page: Page,
): Promise<{ screenshot: Buffer; cleanedHtml: string }> {
  try {
    const cleanedHtml = await fetchAndCleanHtml(page);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `output/${timestamp}.html`;

    // Debugging: Log the filename
    console.log('Generated filename:', filename);

    // Ensure the output directory exists
    const outputDir = path.dirname(filename);
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Write the HTML to the file
    await fs.writeFile(filename, cleanedHtml, 'utf8');
    const screenshotBuffer = await page.screenshot({
      path: `${filename.replace('.html', '.jpeg')}`,
      fullPage: true,
      quality: 20,
      type: 'jpeg',
    });

    console.log(`Cleaned HTML saved to: ${filename}`);
    console.log(`Screenshot saved to: ${filename.replace('.html', '.jpeg')}`);

    return { screenshot: screenshotBuffer, cleanedHtml };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export { capturePageSnapshot };
