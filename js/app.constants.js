var EFormat = {
    DateInView: 'DD/MM/YYYY',
    DateInViewAll: 'HH:mm DD/MM/YYYY',
    DateInViewStartDay: '00:00 DD/MM/YYYY',
    DateInViewEndDay: '23:59 DD/MM/YYYY',
    DateInViewLong: 'HH [giờ] mm [phút, ngày] DD/MM/YYYY',
    DateInViewLongNgay: 'HH [giờ] mm [, ngày] DD [tháng] MM [năm] YYYY',
    DateInViewNgay: '[Ngày] DD [tháng] MM [năm] YYYY',
    DateToServer: 'MM/DD/YYYY',
    DateToServerAll: 'HH:mm MM/DD/YYYY',
    DateNull: '0001-01-01T00:00:00',
    DateISO: 'YYYY-MM-DD[T]HH:mm:ss',
    DayInView: 'DD',
    MonthInView: 'MM',
    YearInView: 'YYYY',
    QuarterYear: 'Q', // QUÝ
    Time: 'HH:mm',
    Time1: 'HH',
    Time2: 'mm',
}

var EIdMonHoc = {
    NguVan: "db87aa48-14a3-4376-9aa8-1cb22948215f",
    TiengAnh: "a9bdfd0c-5807-4c8f-8b08-ff5a009e0385",
};

var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (e) {
        var t = '';
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ((n & 3) << 4) | (r >> 4);
            u = ((r & 15) << 2) | (i >> 6);
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t =
                t +
                this._keyStr.charAt(s) +
                this._keyStr.charAt(o) +
                this._keyStr.charAt(u) +
                this._keyStr.charAt(a);
        }
        return t;
    },
    decode: function (e) {
        var t = '';
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, '');
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = (s << 2) | (o >> 4);
            r = ((o & 15) << 4) | (u >> 2);
            i = ((u & 3) << 6) | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64._utf8_decode(t);
        return t;
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, 'n');
        var t = '';
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192);
                t += String.fromCharCode((r & 63) | 128);
            } else {
                t += String.fromCharCode((r >> 12) | 224);
                t += String.fromCharCode(((r >> 6) & 63) | 128);
                t += String.fromCharCode((r & 63) | 128);
            }
        }
        return t;
    },
    _utf8_decode: function (e) {
        var t = '';
        var n = 0;
        var r = 0,
            c1 = 0,
            c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
                n += 2;
            } else {
                c2 = e.charCodeAt(n + 1);
                var c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode(
                    ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
                );
                n += 3;
            }
        }
        return t;
    },
};

var EMauDuLieu = {
    MauThucDon: 'MauThucDon',
}

var ELoaiTuDien = {
    LoaiSachHay: 'LoaiSachHay',
}

var EIdRole = {
    QuanLy: '3f16b6c5-ec8d-45a9-9ee7-afa7731e9232',
    GiaoVien: '1087a985-65f7-4196-ac7f-afd20352f9e8',
    NhaBep: '2c309dd9-0431-42ae-bc8f-c1c38b762efc',
    PhuHuynh: '1cee587e-dae8-4b8c-90d4-cd79539e8e65',
}
var EIdLoaiThongBao = {
    NhaBep: '96130a0d-ecd6-4208-8c61-26daa7a4fda7',
    ThongBao: 'ee5c5a16-12c3-4650-90e4-bfc59f536195',
    GopY: '14c3b595-c50d-4ed1-a90e-dfd1b4f42389',
    NoiBo: 'd8d2f763-c61c-49f3-8335-d3d1f5b85b05',
    PhanAnh: '4a436aad-23b6-42e1-80e8-f80bd904ca38',
}

var EIcon = {
    Success: '~/assets/Check-green.svg',
    Error: '~/assets/warning.svg',
    Warning: '~/assets/info2.svg',
    Info: '~/assets/info.svg',
    CheckGreen: '~/assets/check-green.png',
}

var EIdTrangThai = {
    CongTyChot: 'e2f656b8-d352-4f41-8e4b-40be81a010e7',
    ChoDuyet: '62fd7097-446c-4898-a402-487ea9ff04e7',
    DaPhat: '3d3ac6f7-ce08-498a-92e6-4b02df6f668e',
    DaHuy: '98bcb823-3fe2-4a11-a0e2-88dc7c1746c9',
    GiaoVienChot: 'a282af1a-1c64-448e-beb7-906f1050b760',
    DaDuyet: 'd389b267-4ae9-4967-a9f2-fedca3e459fd',
}

var EIdLoaiThanhToan = {
    GuiTienGV: 'e3280acf-fab8-4ea2-a198-a137fab7c260',
    ChuyenKhoan: '0c636969-4857-4357-afbc-18717da08df1',
    VNPay: '76caf6fa-8c0c-44b2-ba74-56176d75ca62',
    VMNPay: 'c1838899-4bd3-42c6-aced-d84df6968857'
}



const ChuSo = [
    ' không ',
    ' một ',
    ' hai ',
    ' ba ',
    ' bốn ',
    ' năm ',
    ' sáu ',
    ' bảy ',
    ' tám ',
    ' chín ',
];
const Tien = [
    '',
    ' nghìn',
    ' triệu',
    ' tỷ',
    ' nghìn tỷ',
    ' triệu tỷ',
];
const _idEmpty = '00000000-0000-0000-0000-000000000000';

function dateIsNull(date) {
    if (!date || date === '0001-01-01T00:00:00') {
        return true;
    }
    return false;
}

function guidIsNuLL(str) {
    if (!str || str === '' || str === _idEmpty) {
        return true;
    }
    return false;
}

function guidIsNotNuLL(str) {
    if (str && str !== '' && str !== _idEmpty) {
        return true;
    }
    return false;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function newGuid() {
    // then to call it, plus stitch in '4' in the third group
    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-4' +
        S4().substr(0, 3) +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    ).toLowerCase();
}

function newTransaction() {
    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4()).toLowerCase();
}

function strIsNotNull(str) {
    if (str && str !== '') {
        return true;
    }
    return false;
}

function strIsNull(str) {
    if (typeof str === undefined) {
        return true;
    }
    if (!str || str === '') {
        return true;
    }
    return false;
}

function strInclude(str, str2) {
    if (str && str !== '') {
        return str.includes(str2);
    }
    return false;
}

function strIsTrue(str) {
    if (str && str === 'true') {
        return true;
    }
    return false;
}
function strIsDateTime(str) {
    const d = moment(str, 'YYYY-MM-DD');
    if (d == null || !d.isValid()) {
        return false;
    }

    return str.indexOf(d.format('YYYY-MM-DD')) >= 0;
}

function strToNumber(str) {
    if (str) {
        str = str.replace(/,/g, '');
        return parseFloat(str);
    }
    return null;
}

function checkSDT(mobile) {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (mobile !== '') {
        if (vnf_regex.test(mobile) == false) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
    return false;
}

const KyTu = [
    'aeouidy',
    'áàạảãâấầậẩẫăắằặẳẵ',
    'éèẹẻẽêếềệểễ',
    'óòọỏõôốồộổỗơớờợởỡ',
    'úùụủũưứừựửữ',
    'íìịỉĩ',
    'đ',
    'ýỳỵỷỹ',
];
function strKhongDau(str) {
    if (!str) return '';
    str = str.toLowerCase();
    for (let i = 1; i < KyTu.length; i++) {
        for (let j = 0; j < KyTu[i].length; j++) {
            str = str.replaceAll(KyTu[i][j], KyTu[0][i - 1]);
        }
    }
    return str;
}

function strTimKiem(str, searchStr) {
    if (searchStr) {
        return strKhongDau(str).includes(strKhongDau(searchStr));
    }
    return true;
}

function DocSo3ChuSo(baso) {
    let KetQua = '';
    const tram = Math.floor(baso / 100);
    const chuc = Math.floor((baso % 100) / 10);
    const donvi = Math.floor(baso % 10);
    if (tram === 0 && chuc === 0 && donvi === 0) {
        return '';
    }
    if (tram !== 0) {
        KetQua += ChuSo[tram] + ' trăm ';
        if (chuc === 0 && donvi !== 0) {
            KetQua += ' linh ';
        }
    }
    if (chuc !== 0 && chuc !== 1) {
        KetQua += ChuSo[chuc] + ' mươi';
        if (chuc === 0 && donvi !== 0) {
            KetQua = KetQua + ' linh ';
        }
    }
    if (chuc === 1) {
        KetQua += ' mười ';
    }
    switch (donvi) {
        case 1:
            if (chuc !== 0 && chuc !== 1) {
                KetQua += ' mốt ';
            } else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc === 0) {
                KetQua += ChuSo[donvi];
            } else {
                KetQua += ' lăm ';
            }
            break;
        default:
            if (donvi !== 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}

function DocSoBangChu(SoTien) {
    let lan = 0;
    let i = 0;
    let so = 0;
    let KetQua = '';
    let tmp = '';
    const ViTri = [];
    if (SoTien < 0) {
        return 'Số tiền âm !';
    }
    if (SoTien === 0) {
        return 'Không đồng !';
    }
    if (SoTien > 0) {
        so = SoTien;
    } else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        // SoTien = 0;
        return 'Số quá lớn!';
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5])) {
        ViTri[5] = '0';
    }
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4])) {
        ViTri[4] = '0';
    }
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3])) {
        ViTri[3] = '0';
    }
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = Math.floor(so / 1000000);
    if (isNaN(ViTri[2])) {
        ViTri[2] = '0';
    }
    ViTri[1] = Math.floor((so % 1000000) / 1000);
    if (isNaN(ViTri[1])) {
        ViTri[1] = '0';
    }
    ViTri[0] = so % 1000;
    if (isNaN(ViTri[0])) {
        ViTri[0] = '0';
    }
    if (ViTri[5] > 0) {
        lan = 5;
    } else if (ViTri[4] > 0) {
        lan = 4;
    } else if (ViTri[3] > 0) {
        lan = 3;
    } else if (ViTri[2] > 0) {
        lan = 2;
    } else if (ViTri[1] > 0) {
        lan = 1;
    } else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) {
            KetQua += Tien[i];
        }
        if (i > 0 && tmp.length > 0) {
            KetQua += ',';
        }
    }
    if (KetQua.substring(KetQua.length - 1) === ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    return KetQua;
}

// Hàm để resize ảnh
function resizeImage(base64Str, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = "data:image/png;base64," + base64Str;

        img.onload = function () {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            // Tính toán kích thước mới dựa trên maxWidth và maxHeight
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }

            // Set kích thước mới cho canvas
            canvas.width = width;
            canvas.height = height;

            // Vẽ ảnh resized lên canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Chuyển canvas thành base64
            let resizedBase64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
            resolve(resizedBase64);
        };

        img.onerror = function (error) {
            reject(error);
        };
    });
}

function strDateTime(date, format = EFormat.DateISO) {
    const Date = moment(date, format);
    const index = Date.day();
    return (
        (index != 0 ? 'Thứ ' + (index + 1) : 'Chủ nhật') +
        ' ' +
        Date.format(EFormat.DateInViewNgay)
    );
}

function TinhBMI(chieuCao, canNang) {
    if (isNaN(chieuCao) || isNaN(canNang)) return '';
    return (canNang / ((chieuCao / 100) * (chieuCao / 100))).toFixed(1);
}

function countTwoDay(date1, date2) {
    var a = moment(date1);
    var b = moment(date2);
    return a.diff(b, 'days');
}

function capitalizeWords(str) {
    if (!str) return '';
    const words = str.split(' ');
    const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
}

function formatCurrency(num) {
    return num.toLocaleString('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function isPhoneNumberValid(number) {
    if (number.length != 10) return false;
    return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
}

function calculateChecksum(inputString) {
    let total = 0;
    for (let i = 0; i < inputString.length; i++) {
        total += inputString.charCodeAt(i);
    }

    total %= 26;
    return String.fromCharCode(total + 65);
}

function isValidChecksum(inputString) {
    try {
        var cleanedString = inputString.replace(/[^a-zA-Z]/g, '');

        var numbers = inputString.replace(/[^0-9]/g, '');
        var maCongTy = cleanedString.substring(0, cleanedString.length - 1);
        var checksum = cleanedString.charAt(cleanedString.length - 1);

        if (checksum === calculateChecksum(maCongTy + numbers)) {
            return maCongTy;
        }
        return null;
    } catch (error) {
        return null;
    }
}

function startLoader() {
    $('#loader').fadeIn("fast");
    $('#loader-progress').show();
    setTimeout(() => {
        stopLoader();
    }, 5000);
};
function stopLoader() {
    $('#loader-progress').hide();
    $('#loader').fadeOut();
};

function showAlert(text, s = 3000, func = null) {
    let d1 = s / 1000;
    $('#custom-alert').remove();
    $('.modal-backdrop').remove();

    $('#wrapper').append(`<div class="modal fade" id="custom-alert" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Thông báo</h5>
            </div>
            <div class="modal-body">
                ${text}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="cl-md">Trở về (<span class="intervalId">${d1}</span>)</button>
            </div>
            </div>
        </div>
        </div>`);
    $('#custom-alert').modal('show');

    $('#cl-md').click(() => {
        $('#custom-alert').modal('hide');
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        if (func) func();
    })

    var intervalId = setInterval(function () {
        d1 = d1 - 1;
        $('#custom-alert .intervalId').html(d1);
    }, 1000);

    var timeoutId = setTimeout(() => {
        $('#custom-alert').modal('hide');
        clearInterval(intervalId);
        if (func) func();
    }, s)
}

function showConfirm(title, content, fOk, fClose) {
    return new Promise((resovle, reject) => {
        $('#custom-alert').remove();
        $('.modal-backdrop').remove();
        $('#wrapper').append(`<div class="modal fade" id="custom-alert" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="ok-md">Xác nhận</button>
                    <button type="button" class="btn btn-secondary" id="cl-md">Trở về</button>
                </div>
                </div>
            </div>
            </div>`);
        $('#custom-alert').modal('show');

        $('#ok-md').click(() => {
            $('#custom-alert').modal('hide');
            if (fOk) fOk();
            resovle(true);
        })

        $('#cl-md').click(() => {
            $('#custom-alert').modal('hide');
            if (fClose) fClose();
            resovle(false);
        })
    })


}


