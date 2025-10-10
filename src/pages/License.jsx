import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const eulaText = `END-USER LICENSE AGREEMENT (EULA)

Last Updated: ${new Date().toISOString().split('T')[0]}

This End-User License Agreement ("EULA") is a legal agreement between you and KYDRAS ECHO ("we," "us," or "our") for the Kydras Echo application, which includes computer software and may include associated media, printed materials, and "online" or electronic documentation ("SOFTWARE PRODUCT").

By installing, copying, or otherwise using the SOFTWARE PRODUCT, you agree to be bound by the terms of this EULA. If you do not agree to the terms of this EULA, do not install or use the SOFTWARE PRODUCT.

1. GRANT OF LICENSE.
We grant you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the SOFTWARE PRODUCT strictly in accordance with the terms of this Agreement. You are granted a license to use this software on any device that you own or control.

2. RESTRICTIONS ON USE.
You agree not to, and you will not permit others to:
a) license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the SOFTWARE PRODUCT or make the SOFTWARE PRODUCT available to any third party.
b) modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the SOFTWARE PRODUCT.
c) remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of ours or our affiliates, partners, suppliers or the licensors of the SOFTWARE PRODUCT.

3. INTELLECTUAL PROPERTY.
All rights, title, and interest in and to the SOFTWARE PRODUCT (including but not limited to any images, photographs, animations, video, audio, music, text, and "applets" incorporated into the SOFTWARE PRODUCT), the accompanying printed materials, and any copies of the SOFTWARE PRODUCT are owned by us or our suppliers. The SOFTWARE PRODUCT is protected by copyright laws and international treaty provisions. Therefore, you must treat the SOFTWARE PRODUCT like any other copyrighted material.

4. TERMINATION.
This EULA is effective until terminated. Your rights under this license will terminate automatically without notice from us if you fail to comply with any term(s) of this EULA. Upon the termination of this EULA, you shall cease all use of the SOFTWARE PRODUCT and destroy all copies, full or partial, of the SOFTWARE PRODUCT.

5. DISCLAIMER OF WARRANTY.
THE SOFTWARE PRODUCT IS PROVIDED "AS IS", WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

6. LIMITATION OF LIABILITY.
IN NO EVENT SHALL WE BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE PRODUCT.

7. GOVERNING LAW.
This EULA shall be governed by and construed in accordance with the laws of the jurisdiction in which our business is established, without regard to its conflict of law principles.

By using this software, you acknowledge that you have read this EULA, understand it, and agree to be bound by its terms and conditions.
`;

export default function LicensePage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-black/60 to-gray-900/20 border border-gray-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-100">
              End-User License Agreement (EULA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto p-4 bg-black/30 rounded-lg border border-gray-500/20">
              <pre className="whitespace-pre-wrap font-sans">
                {eulaText}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}