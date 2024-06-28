<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>XML asset</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
    <div class="main-container">
        <h1>Asset</h1>
        <p>To go back to validation click <a href="/">here</a></p>
        <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>acquisition-date</th>
                    <th>acquisition-price [$]</th>
                    <th>liquidation-date</th>
                    <th>liquidation-price [$]</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="/asset/trades/trade">
                    <tr>
                        <td><xsl:value-of select="@id"/></td>
                        <td><xsl:value-of select="acquisition/date"/></td>
                        <td><xsl:value-of select="acquisition/price"/></td>
                        <td><xsl:value-of select="liquidation/date"/></td>
                        <td><xsl:value-of select="liquidation/price"/></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>