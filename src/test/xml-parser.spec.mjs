import assert from 'assert';
import { toXml } from '../utils/xml-parser.mjs';

describe('Modern XML Parser', function() {
  it('handles nested tags with text correctly', function () {
    const result = toXml('<p id="main">yes <b>please!</b></p>');
    
    // Check Parent
    assert.strictEqual(result.tagName, 'p');
    assert.strictEqual(result.properties.id, 'main');
    
    // Check Children
    assert.strictEqual(result.content[0], 'yes '); // First child is text
    assert.strictEqual(result.content[1].tagName, 'b'); // Second child is a node
    assert.strictEqual(result.content[1].content[0], 'please!');
    assert.strictEqual(result.content[1].order, 2);
    
    // Check Order
    assert.strictEqual(result.order, 1); // needs to be 1
  });
});
