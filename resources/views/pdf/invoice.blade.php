<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $pesanan->id }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Invoice Pesanan</h2>
        <p>Tanggal: {{ $pesanan->tgl_pesanan }}</p>
        <p>Pelanggan: {{ $pesanan->pelanggan->nama_pelanggan }}</p>
        <p>Metode Pembayaran: {{ $pesanan->metode_pembayaran }}</p>
        <p>Status: {{ $pesanan->keterangan }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pesanan->details as $i => $item)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $item->produk->nama_produk }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>Rp {{ number_format($item->harga, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->harga * $item->quantity, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="4" class="total">Total</td>
                <td>Rp {{ number_format($pesanan->total, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <p>Terima kasih atas pesanan Anda.</p>
</body>
</html>
