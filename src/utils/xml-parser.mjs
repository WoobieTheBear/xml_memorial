let _order = 1;

export function toXml(xmlString) {
  "use strict";
  const openBracket = "<";
  const openBracketCC = "<".charCodeAt(0);
  const closeBracket = ">";
  const closeBracketCC = ">".charCodeAt(0);
  const minusCC = "-".charCodeAt(0);
  const slashCC = "/".charCodeAt(0);
  const exclamationCC = "!".charCodeAt(0);
  const singleQuoteCC = "'".charCodeAt(0);
  const doubleQuoteCC = '"'.charCodeAt(0);
  const questionMarkCC = "?".charCodeAt(0);

  /**
   * returns text until the first nonAlphabetic letter
   */
  const nameSpacer = "\r\n\t>/= ";

  let pos = 0;
  let startNamePos = pos;
	let startTextPos = pos;
	let startStringPos = pos;
	let charCode = -1;
	let attrFound = false;
	let text = '';
	let startChar = '';
	let propertyName = '';
	let propertyValue = '';
	let nodeTagName = '';
	let nodeAttributes = {};
	let nodeChildren = [];

	const upperCaseAtoZ = (charCode) => {
		return charCode > 64 && charCode < 91;
	}

	const lowerCaseAtoZ = (charCode) => {
		return charCode > 96 && charCode < 123;
	}
  /**
   * Parsing a list of entries
   */
  function parseChildren() {
    const children = [];

    while (xmlString[pos]) {
      if (xmlString.charCodeAt(pos) == openBracketCC) {
        if (xmlString.charCodeAt(pos + 1) === slashCC) { // </
          // while (S[pos]!=='>') { pos++; }
          pos = xmlString.indexOf(closeBracket, pos);
          return children;
        } else if (xmlString.charCodeAt(pos + 1) === exclamationCC) {
          // <! or <!--
          if (xmlString.charCodeAt(pos + 2) == minusCC) {
            // comment support
            while (
              !(
                xmlString.charCodeAt(pos) === closeBracketCC &&
                xmlString.charCodeAt(pos - 1) === minusCC &&
                xmlString.charCodeAt(pos - 2) === minusCC &&
                pos !== -1
              )
            ) {
              pos = xmlString.indexOf(closeBracket, pos + 1);
            }
            if (pos === -1) {
              pos = xmlString.length;
            }
          } else {
            // doctype support
            pos += 2;
            for (; xmlString.charCodeAt(pos) !== closeBracketCC; pos++) {}
          }
          pos++;
          continue;
        } else if (xmlString.charCodeAt(pos + 1) === questionMarkCC) {
          // <?
          // XML header support
          pos = xmlString.indexOf(closeBracket, pos);
          pos++;
          continue;
        }
        pos++;
        startNamePos = pos;
        for (; nameSpacer.indexOf(xmlString[pos]) === -1; pos++) {}
        nodeTagName = xmlString.slice(startNamePos, pos);

        // Parsing attributes
        attrFound = false;
        nodeAttributes = {};
        for (; xmlString.charCodeAt(pos) !== closeBracketCC; pos++) {
          charCode = xmlString.charCodeAt(pos);
          if (upperCaseAtoZ(charCode) || lowerCaseAtoZ(charCode)) {
            startNamePos = pos;
            for (; nameSpacer.indexOf(xmlString[pos]) === -1; pos++) {}
            propertyName = xmlString.slice(startNamePos, pos);

						// search beginning of the string
            var code = xmlString.charCodeAt(pos);
            while (code !== singleQuoteCC && code !== doubleQuoteCC) {
              pos++;
              code = xmlString.charCodeAt(pos);
            }

            startChar = xmlString[pos];
            startStringPos = ++pos;
            pos = xmlString.indexOf(startChar, startStringPos);
            propertyValue = xmlString.slice(startStringPos, pos);
            if (!attrFound) {
              nodeAttributes = {};
              attrFound = true;
            }
            nodeAttributes[propertyName] = propertyValue;
          }
        }

        // Optional parsing of children
        if (xmlString.charCodeAt(pos - 1) !== slashCC) {
          pos++;
          nodeChildren = parseChildren();
        }

        children.push({
          children: nodeChildren,
          tagName: nodeTagName,
          attrs: nodeAttributes,
        });
      } else {
        startTextPos = pos;
				// Skip characters until '<'
        pos = xmlString.indexOf(openBracket, pos) - 1;
        if (pos === -2) {
          pos = xmlString.length;
        }
        text = xmlString.slice(startTextPos, pos + 1);
        if (text.trim().length > 0) {
          children.push(text);
        }
      }
      pos++;
    }
    return children;
  }

  _order = 1;
  return simplify(parseChildren());
}

function simplify(children) {
  let node = {};

  if (typeof children === 'undefined') {
    return {};
  }

  // Text node (e.g. <t>This is text.</t>)
  if (children.length === 1 && typeof children[0] == "string") {
    return children[0];
  }

  // map each object
  children.forEach(function (child) {
    if (!node[child.tagName]) {
      node[child.tagName] = [];
    }

    if (typeof child === "object") {
      var kids = simplify(child.children);
      if (child.attrs) {
        kids.attrs = child.attrs;
      }

      if (kids["attrs"] === undefined) {
        kids["attrs"] = { order: _order };
      } else {
        kids["attrs"]["order"] = _order;
      }
      _order++;
      node[child.tagName].push(kids);
    }
  });

  for (var i in node) {
    if (node[i].length == 1) {
      node[i] = node[i][0];
    }
  }

  return node;
}
