<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tanda Terima Botol Kosong</title>
    <style>
        @page {
            size: A5 portrait;
            margin: 1cm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
        }

        .header h2 {
            margin-bottom: 2px;
            font-size: 16px;
        }

        .header p {
            margin: 2px 0;
            font-size: 10px;
        }

        .title {
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            margin: 12px 0;
        }

        table.info {
            width: 100%;
            font-size: 11px;
            margin-top: 10px;
        }

        table.info td {
            padding: 2px 4px;
            vertical-align: top;
        }

        table.detail {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        table.detail th,
        table.detail td {
            border: 1px solid #000;
            text-align: center;
            padding: 5px;
            width: 25%;
            word-wrap: break-word;
        }

        .signature {
            margin-top: 40px;
            width: 100%;
            font-size: 11px;
            text-align: center;
        }

        .signature td {
            padding-top: 30px;
        }

        .underline {
            display: inline-block;
            border-bottom: 1px solid #000;
            width: 150px;
        }
    </style>
</head>
<body>

<div class="header">
     <img src="{{ public_path('assets/img/logo.png') }}" alt="Logo" width="100">
    <p>spesialis gas medis dan industri</p>
    <p>Perum Permata Green Menganti Regency Blok D2 02 Menganti, Gresik</p>
    <p>Telp / WA 08978810015, 081333244901</p>
</div>

<hr>

<div class="title">TANDA TERIMA TABUNG </div>

<table class="info">
    <tr>
        <td style="width: 60%">Gresik, {{ \Carbon\Carbon::parse($pesanan->tgl_pesanan)->translatedFormat('d F Y') }}</td>
        <td style="text-align: right;">No. {{ str_pad($pesanan->id, 6, '0', STR_PAD_LEFT) }}</td>
    </tr>
    <tr>
        <td>Jenis Botol: O<sub>2</sub>, CO<sub>2</sub>, C<sub>2</sub>H<sub>2</sub>, N<sub>2</sub>, Ar, LPG</td>
    </tr>
    <tr>
        <td>Jumlah Kosong: <span class="underline"></span> botol</td>
        <td>Diterima Dari: {{ $pesanan->pelanggan->nama_pelanggan ?? '' }}</td>
    </tr>
    <tr>
        <td>Jumlah Isi: <span class="underline"></span> botol</td>
        <td>Jam: <span class="underline"></span></td>
    </tr>
</table>

<table class="detail">
    <thead>
        <tr>
            <th style="width: 7%;">No</th>
            <th>Nomor Tabung Kosong</th>
            <th></th>
            <th>Nomor Tabung Isi
            <th></th>
        </tr>
    </thead>
    <tbody>
        @for ($i = 0; $i < 10; $i++)
            <tr>
               <td style="width: 7% ;">{{ $i + 1 }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        @endfor
    </tbody>
</table>

<table class="signature">
    <tr>
        <td>Relasi</td>
        <td>Driver</td>
        <td>Gudang</td>
    </tr>
    <tr>
        <td>( ________________ )</td>
        <td>( ________________ )</td>
        <td>( ________________ )</td>
    </tr>
    <tr>
        <td>Nama Terang</td>
        <td></td>
        <td></td>
    </tr>
</table>

</body>
</html>
