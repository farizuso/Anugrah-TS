<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $pesanan->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        .header img {
            width: 100px;
            margin-bottom: 5px;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .info-box {
            width: 48%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
        }
        .no-border {
            border: none;
        }
        .total-row {
            font-weight: bold;
        }
        .highlight {
            background-color: #fff9c4; /* kuning terang */
            padding: 8px;
            border: 1px solid #f0e68c;
            margin-bottom: 10px;
        }
        .text-right {
            text-align: right;
        }
        .note {
            margin-top: 10px;
            font-style: italic;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
    <img src="{{ public_path('assets/img/logo.png') }}" alt="Logo" width="100">




        <h2>Invoice Pesanan</h2>
    </div>

    <div class="info-section">
        <div class="info-box">
            <h4>Informasi Pemesanan</h4>
            <p>Tanggal Pesanan: <strong>{{ \Carbon\Carbon::parse($pesanan->tgl_pesanan)->format('d M Y') }}</strong></p>
            <p>Metode Pembayaran: <strong>{{ ucfirst($pesanan->metode_pembayaran) }}</strong></p>
            <p>Status Pembayaran: <strong>{{ $pesanan->status_pembayaran }}</strong></p>
            <p>Status Pengiriman: <strong>{{ $pesanan->status }}</strong></p>
        </div>

        <div class="info-box">
            <h4>Informasi Pengiriman</h4>
            <p>Penerima: <strong>{{ $pesanan->pelanggan->nama_pelanggan }}</strong></p>
            <p>Alamat: {{ $pesanan->alamat_pengiriman }}</p>
            <p>No. Telp: {{ $pesanan->no_telp_pengiriman }}</p>
        </div>
    </div>

    @if($pesanan->is_sewa)
    <div class="highlight">
        🛢️ Pesanan ini adalah <strong>Sewa Tabung</strong>.<br>
        Masa sewa 6 bulan. Jika tidak dikembalikan, jaminan sebesar <strong>Rp{{ number_format(1200000, 0, ',', '.') }}/tabung</strong> akan hangus.
    </div>
    @endif

    <table>
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
            <tr class="total-row">
                <td colspan="3" class="text-right">Biaya Pengiriman</td>
                <td>Rp {{ number_format($pesanan->biaya_pengiriman, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="3" class="text-right">Total</td>
                <td>Rp {{ number_format($pesanan->total, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <p class="note">Terima kasih atas kepercayaan Anda!</p>
</body>
</html>
