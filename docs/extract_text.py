import zipfile
import xml.etree.ElementTree as ET
import glob
import os

def read_docx(filename):
    try:
        with zipfile.ZipFile(filename) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for paragraph in tree.findall('.//w:p', ns):
                texts = [node.text for node in paragraph.findall('.//w:t', ns) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {filename}: {e}"

if __name__ == '__main__':
    with open('extracted_text.txt', 'w', encoding='utf-8') as out:
        for f in glob.glob('*.docx'):
            out.write(f"--- {f} ---\n")
            text = read_docx(f)
            out.write(text + "\n\n")
            print(f"Extracted: {f}")
