<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $pesanan->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
        }

        .header img {
            width: 90px;
            margin-bottom: 3px;
        }

        h2 {
            margin: 5px 0;
            font-size: 14px;
        }

      

        .info-table {
            width: 100%;
            margin-top: 5px;
            font-size: 10px;
        }

        .info-table td {
            padding: 2px 4px;
            vertical-align: top;
        }

        .highlight {
            background-color: #f9f9c4;
            border: 1px dashed #999;
            padding: 6px;
            margin: 10px 0;
            font-size: 9px;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 10px;
        }

        table.items th,
        table.items td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }

        .text-right {
            text-align: right;
        }

        .total-row {
            font-weight: bold;
        }

        .note {
            margin-top: 8px;
            font-style: italic;
            font-size: 9px;
        }

        .signature {
            margin-top: 30px;
            width: 100%;
            font-size: 10px;
        }

        .signature td {
            padding-top: 25px;
            text-align: center;
        }

        .underline {
            display: inline-block;
            border-bottom: 1px solid #000;
            width: 140px;
        }
    </style>
</head>
<body>

<div class="header">
    <img src="{{ public_path('assets/img/logo.png') }}" alt="Logo">
    <p>Spesialis Gas Medis & Industri</p>
    <p>Permata Green Menganti Regency Blok D2-02, Gresik | WA: 08978810015, 081333244901</p>
    <hr>
    <h2>INVOICE PESANAN</h2>
</div>

<table class="info-table">
    <tr>
        <td><strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($pesanan->tgl_pesanan)->format('d M Y') }}</td>
        <td><strong>No. Telp:</strong> {{ $pesanan->pelanggan->no_hp }}</td>
        
    </tr>
    <tr>
        <td><strong>Penerima:</strong> {{ $pesanan->pelanggan->nama_pelanggan }}</td>
        <td><strong>Alamat:</strong> {{ $pesanan->pelanggan->alamat }}</td>
    </tr>
</table>

@if($pesanan->jenis_pesanan === 'sewa')
<div class="highlight">
    🛢️ Pesanan ini adalah <strong>Sewa Tabung</strong><br>
    Masa sewa 6 bulan. Jika tidak dikembalikan, jaminan sebesar <strong>Rp {{ number_format(1200000, 0, ',', '.') }}/tabung</strong> akan hangus.
</div>
@endif

<table class="items">
    <thead>
        <tr>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Harga/Unit</th>
            <th>Subtotal</th>
        </tr>
    </thead>
    <tbody>
        @foreach($pesanan->details as $item)
        <tr>
            <td>{{ $item->produk->nama_produk }}</td>
            <td>{{ $item->quantity }} tabung</td>
            <td>Rp {{ number_format($item->harga, 0, ',', '.') }}</td>
            <td>Rp {{ number_format($item->harga * $item->quantity, 0, ',', '.') }}</td>
        </tr>
        @endforeach
        {{-- <tr class="total-row">
            <td colspan="3" class="text-right">Biaya Pengiriman</td>
            <td>Rp {{ number_format($pesanan->biaya_pengiriman, 0, ',', '.') }}</td>
        </tr> --}}
        <tr class="total-row">
            <td colspan="3" class="text-right">Total</td>
            <td>Rp {{ number_format($pesanan->total, 0, ',', '.') }}</td>
        </tr>
    </tbody>
</table>

<div class="note">
    <p><strong>Syarat Pembeli/Penyewa:</strong></p>
    <ol style="margin-left: 15px; padding-left: 10px;">
        <li>Tabung kosong dikembalikan maksimal 14 hari. Lewat itu dikenakan denda Rp5.000/botol/hari.</li>
        <li>Lebih dari 90 hari, tabung dianggap hilang dan diganti Rp2.400.000/tabung.</li>
        <li>Keran rusak/hilang ganti Rp300.000, tutup botol hilang ganti Rp300.000.</li>
        <li>Sewa tabung per bulan Rp100.000.</li>
    </ol>
</div>

<table class="signature">
    <tr>
        <td>Pembeli / Penyewa</td>
        <td>Hormat Kami</td>
    </tr>
    <tr>
        <td>( <span class="underline">&nbsp;</span> )</td>
        <td>( <span class="underline">&nbsp;</span> )</td>
    </tr>
</table>

</body>
</html>
