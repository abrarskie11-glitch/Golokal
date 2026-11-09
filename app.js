const form = document.getElementById("orderForm");
const pesan = document.getElementById("pesan");
const daftarPesanan = document.getElementById("daftarPesanan");

const API_URL = "http://localhost:8080";

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value;
    const layanan = document.getElementById("layanan").value;
    const asal = document.getElementById("asal").value;
    const tujuan = document.getElementById("tujuan").value;

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nama: nama,
                layanan: layanan,
                asal: asal,
                tujuan: tujuan
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        pesan.textContent = "Pesanan berhasil dibuat!";

        form.reset();

        tampilkanPesanan();

    } catch (error) {
        console.error(error);
        pesan.textContent = "Gagal membuat pesanan: " + error.message;
    }
});

async function tampilkanPesanan() {
    try {
        const response = await fetch(`${API_URL}/api/orders`);
        const orders = await response.json();

        daftarPesanan.replaceChildren();

        if (orders.length === 0) {
            daftarPesanan.innerHTML = "<p>Belum ada pesanan.</p>";
            return;
        }

        orders.forEach(order => {
            const kartu = document.createElement("div");

            kartu.style.border = "1px solid #ccd8cf";
            kartu.style.padding = "12px";
            kartu.style.marginTop = "12px";
            kartu.style.borderRadius = "8px";

            kartu.innerHTML = `
                <h3>Pesanan #${order.id}</h3>
                <p>${order.nama} | ${order.layanan}</p>
                <p>${order.asal} → ${order.tujuan}</p>
                <p>Estimasi: Rp${order.harga.toLocaleString("id-ID")}</p>
                <p>Status: ${order.status}</p>
            `;

            daftarPesanan.appendChild(kartu);
        });

    } catch (error) {
        console.error(error);
        daftarPesanan.innerHTML =
            "<p>Backend belum terhubung.</p>";
    }
}

// Memuat pesanan saat halaman dibuka
tampilkanPesanan();