<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tanda Terima Botol Kosong</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 4px; text-align: left; }
    </style>
</head>
<body>
    <h2>TANDA TERIMA BOTOL KOSONG</h2>
    <p><strong>No:</strong> {{ $pesanan->id }}</p>
    <p><strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($pesanan->tgl_pesanan)->format('d-m-Y') }}</p>
    <p><strong>Diterima Dari:</strong> {{ $pesanan->pelanggan->nama_pelanggan }}</p>
    <p><strong>No HP:</strong> {{ $pesanan->pelanggan->no_hp }}</p>

    <h4>Detail Botol Kosong</h4>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Produk</th>
                <th>Jumlah Kosong</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pesanan->details as $i => $detail)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $detail->produk->nama_produk }}</td>
                    <td>{{ $detail->quantity }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <br><br><br>
    <table style="width:100%; border: none;">
        <tr>
            <td style="text-align: center;">Relasi</td>
            <td style="text-align: center;">Driver</td>
            <td style="text-align: center;">Gudang</td>
        </tr>
        <tr>
            <td height="80px"></td>
            <td></td>
            <td></td>
        </tr>
    </table>
</body>
</html>
