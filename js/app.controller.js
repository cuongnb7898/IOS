(function () {
    'use strict';
    var EApiName = {
        DonHang: 'DonHang',
        DSDonHang: 'DSDonHang',
        Banner: 'DMBanner',
        BanTin: 'DMBanTin',
        HTConfig: 'HTConfig',
        DMTrangTinh: 'DMTrangTinh',
        DMTinhThanh: 'DMTinhThanh',
        DMTruongHoc: 'DMTruongHoc',
        DMCongTyPhatHanh: 'DMCongTyPhatHanh',
        CMTuDien: 'tudien'
    }
    var app = angular.module('uiApp');

    app.controller('HomeCtrl', ['$scope', 'svCanhDieu', function ($scope, svCanhDieu) {
        svCanhDieu.getAll({ tbName: EApiName.Banner }).$promise.then(d => {
            $scope.ListBanner = d;
            setTimeout(() => {
                $('.right.carousel-control').click();
            }, 3000);
        });
    }]);

    app.controller('DatSachCtrl', ['$scope', 'svApi', 'svCanhDieu', '$resource', 'svAlert', '$location', 'toaster',
        function ($scope, svApi, svCanhDieu, $resource, svAlert, $location, toaster) {
            // step 1 = chọn trường, 2 = chọn lớp, 3 = chọn tỉnh thành, 4 = chọn quận huyện
            $scope.location = 1;
            $scope.order = 1;
            $scope.DsCongTyPhatHanh = [];
            $scope.DsQuanHuyen = [];
            $scope.DsTruongHoc = [];
            $scope.DsLopHoc = [];
            const mParam = JSON.parse(localStorage.getItem('mParam') || '{}');
            $scope.KhuVuc = mParam.DMTinhThanh ? mParam : { DMTinhThanh: { Ten: 'Chọn tỉnh thành' }, DMQuanHuyen: {}, DMTruongHoc: {} }

            $scope.mChienDich = {};
            $scope.mCongTy = {};
            $scope.mBoSach = {};
            $scope.mThongTin = {};
            $scope.mData = JSON.parse(localStorage.getItem('mHocSinh') || '{}');
            $scope.DsPhuongThucThanhToan = [];
            $scope.isValidEmail = true;

            // Khu vực popup chọn lớp học
            $scope.openChonLopHoc = function () {
                $('#popupChonLopHoc').modal('show');
                if ($scope.KhuVuc.DMTinhThanh?.Id) {
                    $scope.GetTruongHoc();
                }
            }
            $scope.setParam = function () {
                localStorage.setItem('mParam', JSON.stringify($scope.KhuVuc))
            }
            $scope.GetTinhCTPH = function () {
                svCanhDieu.getList({ tbName: EApiName.DMTinhThanh, fName: 'GetTinhCTPH' }).$promise.then((res) => {
                    $scope.DsCongTyPhatHanh = res;
                })
            }

            $scope.chonTinhThanh = function (tinh) {
                if ($scope.KhuVuc.DMTinhThanh.Id != tinh.Id) {
                    $scope.KhuVuc.DMQuanHuyen = {};
                }
                $scope.KhuVuc.DMTinhThanh = tinh;
                svCanhDieu.getList({ tbName: EApiName.DMTinhThanh, fName: 'GetCapDuoi', id: tinh.Id }).$promise.then((res) => {
                    $scope.DsQuanHuyen = res;
                    $scope.ChangeStep(4);
                })
                $scope.setParam();
            }
            $scope.chonQuanHuyen = function (huyen) {
                $scope.KhuVuc.DMQuanHuyen = huyen;
                $scope.ChangeStep(1);
                $scope.setParam();
                $scope.GetTruongHoc();
            }

            $scope.GetTruongHoc = function (sSearch = '') {
                startLoader();
                svCanhDieu.get({
                    tbName: EApiName.DMTruongHoc,
                    fName: 'dsTruongHoc',
                    sSearch: '',
                    iPageIndex: 1,
                    iPageSize: 100,
                    idTinhThanh: $scope.KhuVuc.DMTinhThanh.Id,
                    idQuanHuyen: $scope.KhuVuc.DMQuanHuyen.Id
                }).$promise.then((res) => {
                    $scope.DsTruongHoc = res.List;
                    stopLoader();
                }, (err) => {
                    stopLoader();
                })
            }
            $scope.chonTruongHoc = function (truong) {
                // load api ctph
                startLoader();
                $scope.DsLopHoc = [];
                $scope.KhuVuc.DMTruongHoc = truong;
                $scope.setParam();
                svCanhDieu.get({
                    tbName: EApiName.DMCongTyPhatHanh,
                    fName: 'byma',
                    ma: truong.MaCongTy
                }).$promise.then((res) => {
                    res.DMTruongHoc = truong;
                    localStorage.setItem('CongTy', JSON.stringify(res));
                    localStorage.setItem('appUrl', res.UrlWeb);
                    localStorage.setItem('apiUrl', res.UrlApi);
                    svApi = getApiResource($resource);
                    $scope.GetChienDich();
                    $scope.GetLopHoc();
                }, (err) => {
                    stopLoader();
                })
            }

            $scope.GetChienDich = function () {
                svApi.get({
                    tbName: 'chiendich',
                    fName: 'GetChienDichHienTai',
                    isGiaoVien: false
                }).$promise.then((res) => {
                    $scope.mChienDich = res;
                })
            }

            $scope.GetLopHoc = function () {
                svApi.getList({ tbName: 'lophoc', fName: 'DsLopHoc', idTruongHoc: $scope.KhuVuc.DMTruongHoc.Id }).$promise.then((res) => {
                    $scope.DsLopHoc = res;
                    $scope.ChangeStep(2);
                    stopLoader();
                })
            }

            $scope.chonLopHoc = function (lop) {
                startLoader();
                svApi.getbyid({
                    tbName: 'lophoc',
                    fName: 'GetByMa',
                    ma: lop.Ma
                }).$promise.then((res) => {
                    $scope.mLopHoc = res;
                    $scope.mCongTy = JSON.parse(localStorage.getItem('CongTy') || '{}');
                    $('#popupChonLopHoc').modal('hide');
                    stopLoader();
                }, (err) => {
                    stopLoader();
                })
            }

            $scope.changeMaLop = async function () {
                $scope.mLopHoc.Ma = $scope.mLopHoc.Ma.toUpperCase();
                if ($scope.mLopHoc.Ma.length < 8) {
                    return;
                }
                const code = isValidChecksum($scope.mLopHoc.Ma);
                if (!code) {
                    showAlert('Mã lớp bạn nhập chưa đúng, vui lòng kiểm tra lại!', 3000, () => { $('#malop').focus(); });
                    $scope.mLopHoc = { Ma: $scope.mLopHoc.Ma };

                    // thông báo nhập sai
                    return;
                }

                // nếu chưa có mCongTy thì load theo code kia
                if (!$scope.mCongTy.Id || $scope.mCongTy.MaDatSach != code) {
                    var congty = await svCanhDieu.get({
                        tbName: EApiName.DMCongTyPhatHanh,
                        fName: 'byma',
                        ma: code
                    }).$promise;

                    if (congty) {
                        $scope.mCongTy = congty;
                        localStorage.setItem('CongTy', JSON.stringify($scope.mCongTy));
                        localStorage.setItem('appUrl', $scope.mCongTy.UrlWeb);
                        localStorage.setItem('apiUrl', $scope.mCongTy.UrlApi);
                        svApi = getApiResource($resource);
                        $scope.GetChienDich();
                    } else {
                        // không tìm thấy công ty
                        showAlert('Mã lớp bạn nhập chưa đúng, vui lòng kiểm tra lại!')
                    }
                }

                if ($scope.mCongTy.Id) {
                    // get lớp học
                    var data = await svApi.getbyid({
                        tbName: 'lophoc',
                        fName: 'GetByMa',
                        ma: $scope.mLopHoc.Ma
                    }).$promise;
                    if (data.Id) {
                        $scope.mLopHoc = data;
                        applyPage();
                    } else {
                        // không tìm thấy mã lớp
                        $scope.mLopHoc = { Ma: $scope.mLopHoc.Ma };
                        showAlert('Mã lớp bạn nhập chưa đúng, vui lòng kiểm tra lại!')
                        applyPage();
                    }
                }
            }
            // thay đổi page
            $scope.ChangeStep = function (step) {
                $scope.location = step;
            }

            $scope.checkEmail = function () {
                return new Promise((resovle, reject) => {
                    $scope.isValidEmail = true;
                    $scope.msgEmail = '';
                    if ($scope.mData.Email) {
                        $scope.isValidEmail = ValidateEmail($scope.mData.Email);
                    } else {
                        resovle(true);
                        return;
                    }
                    if ($scope.isValidEmail) {
                        if ($scope.validEmail == $scope.mData.Email) {
                            resovle(true);
                            return;
                        }
                        // check thêm đã đăng ký chưa
                        try {
                            svApi.get({ tbName: 'HTConfig', fName: 'checkmail', email: $scope.mData.Email }).$promise.then((res) => {
                                if (res) {
                                    $scope.isValidEmail = res.isValid;
                                    $scope.validEmail = JSON.parse(JSON.stringify($scope.mData.Email));
                                    $scope.msgEmail = res.message || '';
                                }
                                resovle($scope.isValidEmail);
                            });
                        } catch (error) {
                            resovle(true);
                        }
                    } else {
                        $scope.msgEmail = 'Địa chỉ email không hợp lệ!';
                        resovle(false);
                    }
                })

            }

            // TẢI DANH SÁCH KHỐI LỚP
            $scope.GetChienDichKhoiLop = async function () {
                // kiểm tra thông tinh trước khi gọi api
                if ($scope.mData.Email) {
                    if ($scope.validEmail != $scope.mData.Email) {
                        if (!await $scope.checkEmail()) {
                            showAlert($scope.msgEmail || 'Địa chỉ email không hợp lệ');
                            return;
                        }
                    }

                }
                if ($scope.mData.DienThoai && !checkSDT($scope.mData.DienThoai)) {
                    showAlert('Số điện thoại không hợp lệ');
                    return;
                }

                $scope.mBoSach = [];
                $scope.mThongTin = { TongTien: 0, SoLuong: 0 };
                $scope.strDonVi = 'quyển';
                localStorage.setItem('mHocSinh', JSON.stringify($scope.mData));
                var checkValid = await svApi.getList({
                    tbName: EApiName.DSDonHang,
                    fName: 'getByDienThoai',
                    sdt: $scope.mData.DienThoai
                }).$promise;
                var mActive = checkValid.find(x => x.Active && x.IdChienDich == $scope.mChienDich.Id);
                if (mActive) {
                    var isConfrim = await showConfirm('Thông báo', `Hệ thống phát hiện số điện thoại <br>${mActive.DienThoai} đã đặt hàng trước đó <br> Mã đơn hàng <a >
                ${mActive.MaDonHang}</a> lúc ${moment(mActive.NgayTao).format(EFormat.DateInViewAll)}
                <br> Bạn có muốn tiếp tục đặt tiếp!`);

                    if (!isConfrim) {
                        return;
                    }
                }
                const data = await svApi.get({
                    tbName: 'chiendich',
                    fName: 'GetChienDichKhoiLop',
                    idChienDich: $scope.mChienDich.Id,
                    idKhoiLop: $scope.mLopHoc.IdKhoiLop,
                    idPhongGD: $scope.mLopHoc.IdPhongGD,
                    idTruong: $scope.mLopHoc.IdTruongHoc
                }).$promise;
                const dsSanPham = data.DSChienDichChiTiet;
                if (!dsSanPham) {
                    showAlert('Lớp của bạn chưa đăng ký bộ sách!');
                    return;
                }
                if (dsSanPham.length == 0) {
                    showAlert('Lớp của bạn chưa đăng ký bộ sách!');
                    return;
                }

                if ($scope.mLopHoc.DieuChinhBoSach) {
                    dsSanPham = data.DSChienDichChiTiet.filter(x => !$scope.mLopHoc.DieuChinhBoSach.includes(x.MaSanPham));
                }

                for (let i = 0; i < dsSanPham.length; i++) {
                    const sp = dsSanPham[i];
                    sp.SoLuong = 0;
                    const nhom = $scope.mBoSach.find(x => x.IdLoai == sp.IdLoai);
                    if (nhom) {
                        nhom.DanhSachs.push(sp);
                    } else {
                        const nhomsach = {
                            TenLoai: sp.DanhMuc || 'Chưa phân loại',
                            IdLoai: sp.IdLoai,
                            DanhSachs: [sp]
                        };
                        $scope.mBoSach.push(nhomsach);
                    }

                    if (sp.Ten.startsWith('Bộ')) {
                        $scope.strDonVi = 'bộ';
                    }
                }

                $scope.mBoSach = $scope.mBoSach.sort((a, b) => {
                    if (a.IdLoai === null) return 1;
                    if (b.IdLoai === null) return -1;
                    return 0;
                });
                $scope.openChonBoSach();
            }
            $scope.changeTatCa = function (type) {
                for (let b = 0; b < $scope.mBoSach.length; b++) {
                    const data = $scope.mBoSach[b];
                    for (let i = 0; i < data.DanhSachs.length; i++) {
                        const sp = data.DanhSachs[i];
                        if (type == 1) {
                            // tăng
                            sp.SoLuong = sp.SoLuong + 1;
                        } else {
                            // giảm
                            sp.SoLuong = sp.SoLuong - 1;
                            if (sp.SoLuong < 0) {
                                sp.SoLuong = 0;
                            }
                        }
                    }
                }
                $scope.sumTongTien();
            }
            $scope.changeBoSach = function (data, type) {
                for (let i = 0; i < data.DanhSachs.length; i++) {
                    const sp = data.DanhSachs[i];
                    if (type == 1) {
                        // tăng
                        sp.SoLuong = sp.SoLuong + 1;
                    } else {
                        // giảm
                        sp.SoLuong = sp.SoLuong - 1;
                        if (sp.SoLuong < 0) {
                            sp.SoLuong = 0;
                        }
                    }
                }
                $scope.sumTongTien();
            }

            $scope.changeSach = function (sp, type) {
                if (type == 1) {
                    // tăng
                    sp.SoLuong = sp.SoLuong + 1;
                } else {
                    // giảm
                    sp.SoLuong = sp.SoLuong - 1;
                    if (sp.SoLuong < 0) {
                        sp.SoLuong = 0;
                    }
                }
                $scope.sumTongTien();
            }

            $scope.sumTongTien = function () {
                $scope.mThongTin.TongTien = 0;
                $scope.mThongTin.SoLuong = 0;

                for (let i = 0; i < $scope.mBoSach.length; i++) {
                    const bosach = $scope.mBoSach[i];
                    for (let y = 0; y < bosach.DanhSachs.length; y++) {
                        const sp = bosach.DanhSachs[y];
                        if (sp.SoLuong > 0) {
                            $scope.mThongTin.TongTien += sp.GiaBan * sp.SoLuong;
                            $scope.mThongTin.SoLuong += sp.SoLuong;
                        }
                    }
                }
            }

            $scope.openChonBoSach = function () {
                $('#popupChonBoSach').modal('show');
                applyPage()
            }

            $scope.openXacNhan = function () {
                if (!$scope.mThongTin.SoLuong || $scope.mThongTin.SoLuong == 0) {
                    showAlert('Bạn chưa chọn sách, bộ sách nào!');
                    return;
                }
                $scope.mThongTin.DSChiTietDonHang = [];
                $scope.mThongTin.SanPhamViews = [];
                // Lấy những quyển có số lượng là > 0
                for (let b = 0; b < $scope.mBoSach.length; b++) {
                    const data = $scope.mBoSach[b];
                    for (let i = 0; i < data.DanhSachs.length; i++) {
                        const sp = data.DanhSachs[i];
                        if (sp.SoLuong > 0) {
                            $scope.mThongTin.DSChiTietDonHang.push({
                                IdSanPham: sp.IdSanPham,
                                SoLuong: sp.SoLuong,
                                GiaBan: sp.GiaBan,
                                ThuTu: sp.ThuTu,
                                DanhMuc: sp.DanhMuc,
                                IdLoai: sp.IdLoai,
                                UrlHinhAnh: sp.UrlHinhAnh,
                                Ten: sp.Ten,
                                Active: true
                            })
                        }
                    }
                }

                // Hiển thị ở view để xem
                for (let i = 0; i < $scope.mThongTin.DSChiTietDonHang.length; i++) {
                    const sp = $scope.mThongTin.DSChiTietDonHang[i];
                    const nhom = $scope.mThongTin.SanPhamViews.find(x => x.IdLoai == sp.IdLoai);
                    if (nhom) {
                        nhom.DanhSachs.push(sp);
                    } else {
                        const nhomsach = {
                            TenLoai: sp.DanhMuc || 'Chưa phân loại',
                            IdLoai: sp.IdLoai,
                            DanhSachs: [sp]
                        };
                        $scope.mThongTin.SanPhamViews.push(nhomsach);
                    }

                    if (sp.Ten.startsWith('Bộ')) {
                        $scope.strDonVi = 'bộ';
                    }
                }
                $scope.order = 2;
                // load phương thức thanh toán
                $scope.LoadPhuongThucThanhToan();
            }

            $scope.LoadPhuongThucThanhToan = function () {
                svApi.getList({ tbName: EApiName.CMTuDien, fName: 'PhuongThucThanhToan' }).$promise.then((res) => {
                    $scope.DsPhuongThucThanhToan = res;
                    if ($scope.mLopHoc?.YeuCauThanhToan == 1) {
                        $scope.DsPhuongThucThanhToan = $scope.DsPhuongThucThanhToan.filter(
                            (x) => x.MaTuDien != 'GuiTienGV'
                        );
                    }

                    $scope.mThongTin.IdPhuongThucThanhToan = $scope.DsPhuongThucThanhToan[0]?.Id;
                })
            }

            $scope.thayDoiPhuongThuc = function (item) {
                $scope.mThongTin.IdPhuongThucThanhToan = item.Id;
            }

            $scope.closeXacNhan = function () {
                $scope.order = 1;
            }

            $scope.HoanThanhDatSach = function () {
                $scope.mThongTin.DienThoai = $scope.mData.DienThoai;
                $scope.mThongTin.TenHocSinh = $scope.mData.HoTenHocSinh;
                $scope.mThongTin.TenPhuHuynh = $scope.mData.HoTenPhuHuynh;
                // if ($scope.mData.NgaySinh) {
                //     $scope.mThongTin.NgaySinh = $scope.mData.NgaySinh;
                // }
                $scope.mThongTin.ThanhToan = $scope.DsPhuongThucThanhToan.find(
                    (x) => x.Id == $scope.mThongTin.IdPhuongThucThanhToan
                )?.Ten;
                $scope.mThongTin.IdChienDich = $scope.mChienDich.Id;

                $scope.mThongTin.IdTruongHoc = $scope.mLopHoc.IdTruongHoc;
                $scope.mThongTin.IdLopHoc = $scope.mLopHoc.Id;
                $scope.mThongTin.TenKhoiLop = $scope.mLopHoc.KhoiLop;
                $scope.mThongTin.IdKhoiLop = $scope.mLopHoc.IdKhoiLop;
                $scope.mThongTin.IdPhongGD = $scope.mLopHoc.IdPhongGD;
                $scope.mThongTin.ITrangThai = 0;
                $scope.mThongTin.TongSoSach = $scope.mThongTin.SoLuong;
                $scope.mThongTin.Active = true;
                $scope.mThongTin.LoaiThanhToan = '';
                $scope.mThongTin.TenChienDich = $scope.mChienDich.Ten;
                $scope.mThongTin.TenTruongHoc = $scope.mLopHoc.TruongHoc;
                $scope.mThongTin.TenPhongGD = $scope.mLopHoc.PhongGD;
                $scope.mThongTin.TenLopHoc = $scope.mLopHoc.Ten;


                svApi.createOrUpdate({ tbName: EApiName.DSDonHang }, $scope.mThongTin).$promise.then((res) => {
                    if (res.Id) {
                        //showAlert('Đặt hàng thành công');
                        toaster.success('Đặt hàng thành công!', '', 5000);
                        // đóng các modal
                        $scope.mThongTin = {};
                        $scope.mThongTin = {};
                        $('#popupChonBoSach').modal('hide');
                        $('#popupChonLopHoc').modal('hide');
                        $('.modal-backdrop').remove();
                        $scope.ChuyenHuongPage(res);
                    } else {
                        showAlert('Đặt hàng không thành công');
                    }
                }, (err) => {
                    showAlert(err || 'Đặt hàng không thành công');
                })
            }
            $scope.ChuyenHuongPage = function (data) {
                if (EIdLoaiThanhToan.VMNPay === data.IdPhuongThucThanhToan) {
                    // thanh toans vmn => chuyển hướng đến trang thanh toán
                    $location.path('/thanh-toan-vmn/' + data.MaDonHang);
                } else if (EIdLoaiThanhToan.GuiTienGV === data.IdPhuongThucThanhToan || !data.IdPhuongThucThanhToan) {
                    // gửi tiền giáo viên chuyển hướng đến trang lịch sử
                    $location.path('/lich-su');
                }
            }

            function applyPage() {
                try {
                    $scope.$apply();
                } catch (error) { }
            }
            setTimeout(() => {
                $scope.GetTinhCTPH();
            }, 100)
        }]);
    app.controller('ChuyenKhoanCtrl', ['$scope', 'svApi', function ($scope, svApi) {

    }]);

    app.controller('LichSuCtrl', ['$scope', 'svApi', '$location', function ($scope, svApi, $location) {
        $scope.mHocSinh = {};
        $scope.DsDonHang = [];
        $scope.EIdLoaiThanhToan = EIdLoaiThanhToan;

        $scope.getBySDT = function () {
            if (strIsNotNull($scope.mHocSinh.DienThoai) && $scope.mHocSinh.DienThoai.length == 10) {
                svApi.getList({
                    tbName: 'DSDonHang', fName: 'getByDienThoai',
                    sdt: $scope.mHocSinh.DienThoai
                }).$promise.then((res) => {
                    $scope.DsDonHang = res;
                });
            }
        }
        $scope.ChuyenHuongPage = function (data) {
            if (EIdLoaiThanhToan.VMNPay === data.IdPhuongThucThanhToan) {
                // thanh toans vmn => chuyển hướng đến trang thanh toán
                $location.path('/thanh-toan-vmn/' + data.MaDonHang);
            } else if (EIdLoaiThanhToan.GuiTienGV === data.IdPhuongThucThanhToan || !data.IdPhuongThucThanhToan) {
                // gửi tiền giáo viên chuyển hướng đến trang lịch sử
                $location.path('/lich-su');
            }
        }
        $scope.xemChiTiet = function (item) {
            $location.path('/don-hang/' + item.Id);
        }
        setTimeout(() => {
            const mHocSinh = localStorage.getItem('mHocSinh');
            if (mHocSinh) {
                $scope.mHocSinh = JSON.parse(mHocSinh);
                $scope.getBySDT();
            }
        }, 100);
    }]);

    app.controller('GioiThieuCtrl', ['$scope', 'svApi', 'svCanhDieu', '$sce', '$stateParams', function ($scope, svApi, svCanhDieu, $sce, $stateParams) {
        svCanhDieu.get({ tbName: EApiName.DMTrangTinh, fName: $stateParams.id }).$promise.then(d => {
            $scope.Content = $sce.trustAsHtml(d.NoiDung || '');

        });
    }]);

    app.controller('ProfileCtrl', ['$scope', 'svApi', 'svCanhDieu', '$sce', '$rootScope', function ($scope, svApi, svCanhDieu, $sce, $rootScope) {
        if (!$rootScope.DanhSachGioiThieu) {
            svCanhDieu.showPage({ tbName: EApiName.DMTrangTinh, sSearch: '', idTinhThanh: '', iPageIndex: 1, iPageSize: 100 }).$promise.then(d => {
                $rootScope.DanhSachGioiThieu = d.List || [];

            });
        }

    }]);

    app.controller('ThanhToanCtrl', ['$scope', 'svApi', 'svCanhDieu', '$stateParams', '$location', function ($scope, svApi, svCanhDieu, $stateParams, $location) {
        $scope.DonHang = {};
        $scope.vnpData = {};
        $scope.getDonHang = function () {
            svApi.getbyid({ tbName: EApiName.DSDonHang, fName: 'getByMa', ma: $stateParams.id }).$promise.then((res) => {
                $scope.DonHang = res;
                $scope.DonHang.StrTongSoSach = DocSoBangChu(res.TongTien || 0);

                $scope.vnpData.Amount = res.TongTien;
                $scope.vnpData.OrderId = res.MaDonHang;
                $scope.getLink()
            })

        }
        $scope.getLink = function () {
            svApi.post({ tbName: 'ttspay', fName: 'getLinktt' }, $scope.vnpData).$promise.then(res => {
                $scope.vnpData.linkVmn = res?.linktt;
            });
        }
        $scope.thanhToanNgay = function () {
            window.open($scope.vnpData.linkVmn, '_blank');
        }
        setTimeout(() => {
            $scope.getDonHang();
        }, 100);
    }]);


    app.controller('DonHangCtrl', ['$scope', 'svApi', 'svCanhDieu', '$stateParams', '$location', function ($scope, svApi, svCanhDieu, $stateParams, $location) {
        $scope.DonHang = {};
        $scope.mCongTy = {};
        $scope.EIdLoaiThanhToan = EIdLoaiThanhToan;
        $scope.getDonHang = function () {
            svApi.get({ tbName: 'DSDonHang', fName: $stateParams.id }).$promise.then((res) => {
                $scope.DonHang = res;
                $scope.DonHang.SanPhamViews = [];
                for (let i = 0; i < $scope.DonHang.DSChiTietDonHang.length; i++) {
                    const sp = $scope.DonHang.DSChiTietDonHang[i];
                    const nhom = $scope.DonHang.SanPhamViews.find(x => x.IdLoai == sp.IdLoai);
                    if (nhom) {
                        nhom.DanhSachs.push(sp);
                    } else {
                        const nhomsach = {
                            TenLoai: sp.DanhMuc || 'Chưa phân loại',
                            IdLoai: sp.IdLoai,
                            DanhSachs: [sp]
                        };
                        $scope.DonHang.SanPhamViews.push(nhomsach);
                    }

                    if (sp.TenSanPham?.startsWith('Bộ')) {
                        $scope.strDonVi = 'bộ';
                    }
                }

                $scope.getCongTyPhatHanh();
            })
        }

        $scope.getCongTyPhatHanh = function () {
            var congty = localStorage.getItem('CongTy');
            if (congty) {
                var obj = JSON.parse(congty);
                svCanhDieu.get({ tbName: 'DMCongTyPhatHanh', fName: 'byma', ma: obj.MaDatSach }).$promise.then((res) => {
                    $scope.mCongTy = res;
                })
            }

        }

        $scope.huyDon = async function () {
            var isConfrim = await showConfirm('Thông báo', `Xác nhận hủy đơn hàng!`);

            if (!isConfrim) {
                return;
            }

            svApi.get({tbName: 'DSDonHang', fName: 'huyDon', id: $scope.DonHang.Id}).$promise.then((res) => {
                console.log(res)
                showAlert('Hủy đơn thành công');
                $scope.getDonHang();
                try {
                    $scope.$apply();
                } catch (error) {
                    
                }
            }, (err) => {
                showAlert(err.data?.Message || 'Hủy đơn không thành công'); 
            })

        }

        setTimeout(() => {
            $scope.getDonHang();
        }, 100);
    }]);

})();