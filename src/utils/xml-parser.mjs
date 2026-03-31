let _order = 1;

export function toXml(xmlString) {
  "use strict";
  let pos = 0;
  _order = 1; 

  const openBracket = "<";
  const closeBracket = ">";
  // Added \s to nameSpacer to handle spaces between attributes better
  const nameSpacer = "\r\n\t >/= ";

  function parse() {
    const nodes = [];

    while (pos < xmlString.length) {
      const nextOpen = xmlString.indexOf(openBracket, pos);

      // 1. HANDLE TEXT CONTENT (Preserving intentional spaces)
      if (nextOpen > pos || nextOpen === -1) {
        let textEnd = nextOpen === -1 ? xmlString.length : nextOpen;
        let text = xmlString.slice(pos, textEnd);
        
        // If it's not just empty whitespace, keep it (including trailing spaces!)
        if (text.trim().length > 0) {
          nodes.push(text); 
        }
        pos = textEnd;
        if (nextOpen === -1) break;
      }

      // 2. HANDLE CLOSING TAGS (Stop recursion)
      if (xmlString[pos + 1] === "/") {
        pos = xmlString.indexOf(closeBracket, pos) + 1;
        if (pos === 0) pos = xmlString.length; // Safety break
        return nodes; 
      }

      // 3. HANDLE COMMENTS / DOCTYPE / PROLOG
      if (xmlString[pos + 1] === "!" || xmlString[pos + 1] === "?") {
        let nextClose = xmlString.indexOf(closeBracket, pos);
        pos = (nextClose === -1) ? xmlString.length : nextClose + 1;
        continue;
      }

      // 4. HANDLE OPENING TAGS
      pos++; // Move past '<'
      let startName = pos;
      while (pos < xmlString.length && nameSpacer.indexOf(xmlString[pos]) === -1) {
        pos++;
      }
      let tagName = xmlString.slice(startName, pos);

      // --- PARSE ATTRIBUTES ---
      let properties = {};
      while (pos < xmlString.length && xmlString[pos] !== closeBracket && xmlString[pos] !== "/") {
        let char = xmlString[pos];
        // If it's an alphanumeric start of an attribute name
        if (/[a-zA-Z0-9]/.test(char)) {
          let startAttr = pos;
          while (pos < xmlString.length && nameSpacer.indexOf(xmlString[pos]) === -1) pos++;
          let attrName = xmlString.slice(startAttr, pos);
          
          // Move to the quote after '='
          let startQuote = xmlString.indexOf('"', pos);
          let startQuoteAlt = xmlString.indexOf("'", pos);
          
          // Pick the closest quote
          let quoteType = (startQuote !== -1 && (startQuote < startQuoteAlt || startQuoteAlt === -1)) ? '"' : "'";
          let quotePos = xmlString.indexOf(quoteType, pos);
          
          if (quotePos !== -1) {
            let startVal = quotePos + 1;
            let endVal = xmlString.indexOf(quoteType, startVal);
            if (endVal !== -1) {
              properties[attrName] = xmlString.slice(startVal, endVal);
              pos = endVal + 1;
              continue;
            }
          }
        }
        pos++; // Keep moving if no attribute match
      }

      const isSelfClosing = xmlString[pos] === "/";
      
      // Move past the closing '>'
      let endOfTag = xmlString.indexOf(closeBracket, pos);
      pos = (endOfTag === -1) ? xmlString.length : endOfTag + 1;

      // 5. CREATE THE NODE
      const node = {
        tagName: tagName,
        properties: properties,
        order: _order++,
        content: isSelfClosing ? [] : parse() 
      };

      nodes.push(node);
    }
    return nodes;
  }

  const result = parse();
  return Array.isArray(result) && result.length === 1 ? result[0] : result;
}