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
  it('handles real files', function () {
    const result = toXml(`
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="asset_destination.xsl" ?>
<asset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="asset_definition.xsd">
    <title>USDBTC</title>
    <risk>0.8</risk>
    <related>ETHUSD</related>
    <assetClass>STOCK</assetClass>
    <trades>
        <trade id="eeff0000">
            <acquisition>
                <date>2004-08-24</date>
                <price>2240.45</price>
            </acquisition>
            <liquidation>
                <date>2012-08-24</date>
                <price>4233.45</price>
            </liquidation>
        </trade>
        <trade id="eeff0001">
            <acquisition>
                <date>2024-08-24</date>
                <price>45340.45</price>
            </acquisition>
            <liquidation>
                <date>2025-08-24</date>
                <price>150233.45</price>
            </liquidation>
        </trade>
        <trade id="eeff0002">
            <acquisition>
                <date>2024-08-28</date>
                <price>48340.65</price>
            </acquisition>
        </trade>
    </trades>
</asset>
      `);
    
    // Check Parent
    assert.strictEqual(result.tagName, 'asset');
    assert.strictEqual(result.properties['xmlns:xsi'], 'http://www.w3.org/2001/XMLSchema-instance');
    
    // Check Children
    assert.strictEqual(result.content[0].tagName, 'title'); // First child is text
    assert.strictEqual(result.content[0].order, 2);
    assert.strictEqual(result.content[0].content[0], 'USDBTC');
    
    // Check Order
    assert.strictEqual(result.order, 1); // needs to be 1
  });
});
