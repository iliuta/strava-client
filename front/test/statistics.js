const Statistics = require('../js/statistics.js');

var assert = require('chai').assert;

let athleteProfile = {
    "id": 1321007,
    "profile": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1321007/361713/3/large.jpg",
    "city": "Courbevoie",
    "state": "UUnOg7",
    "country": "France",
    "premium": false,
    "email": "abcd@e.com",
    "sex": "M",
    "bikes": [
        {
            "id": "b1232920",
            "primary": true,
            "name": "BH G5",
            "distance": 25087222,
            "resource_state": 2
        },
        {
            "id": "b4192689",
            "primary": false,
            "name": "Fixie Inc. ",
            "distance": 178610,
            "resource_state": 2
        },
        {
            "id": "b454138",
            "primary": false,
            "name": "Giant Defy 1",
            "distance": 9437246,
            "resource_state": 2
        },
        {
            "id": "b662369",
            "primary": false,
            "name": "Gitane '80s",
            "distance": 371587,
            "resource_state": 2
        },
        {
            "id": "b526413",
            "primary": false,
            "name": "Grand Canyon AL 6.0",
            "distance": 1762982,
            "resource_state": 2
        },
        {
            "id": "b1534132",
            "primary": false,
            "name": "Kona Dr Good",
            "distance": 11525268,
            "resource_state": 2
        },
        {
            "id": "b4119602",
            "primary": false,
            "name": "Vélo de location",
            "distance": 111132,
            "resource_state": 2
        }
    ],
    "shoes": [
        {
            "id": "s4119602",
            "primary": false,
            "name": "Adidas",
            "distance": 111132,
            "resource_state": 2
        }
    ],
    "clubs": [
        {
            "id": "222539",
            "name": "' 78 _ 92 ' IDF Les coureurs de l'Ouest",
            "profile": "avatar/club/large.png",
            "resource_state": 2,
            "profile_medium": "avatar/club/medium.png"
        }
    ],
    "resource_state": 3,
    "firstname": "Adrian",
    "lastname": "P.",
    "profile_medium": "https://dgalywyr863hv.cloudfront.net/pictures/athletes/1321007/361713/3/medium.jpg",
    "created_at": 1352801618000,
    "updated_at": 1504874140000,
    "follower_count": 142,
    "friend_count": 134,
    "date_preference": "%d/%m/%Y",
    "measurement_preference": "meters"
};

let activities = [
    {
        "id": "1164200744",
        "name": "N'imp + bof bof",
        "athlete": {
            "id": 1321007
        },
        "distance": 183668.3,
        "type": "Ride",
        "map": {
            "id": "a1164200744",
            "polyline": null,
            "summary_polyline": "{wmiHsixLeAoFfi@yf@hb@b|@re@l]nv@fy@ve@pfAnbAta@ju@_E|b@vKc@dWfHpEu@mFeDOpRdX~L`sDra@ndA~@jRfMuBpSjQhFlm@qArQpGzTtBz\\dEpIpLjH~k@yAjb@hz@bQgZ|GxA~IbZrFuQrHfCzEdXnQrNx\\tRro@dKpLtJlKcDbUaz@hGyInEuWnS|WpCiI`IpFgDfTra@bp@Crb@eF\\yTd|@cU}VmGlg@fJpEsJ}Bg_@dfClI|f@pk@nY`[xu@aFvn@bRdf@nGzk@`GbE|BbU~Jh[EnOhs@jkBxHvKnXaZdM`g@`L{@~IkFlJoRd]sVnCce@q@ut@vHq\\c@g[jGyd@rUs\\d\\mNp`@kEtIbD`OvTaFmy@t@gQtEuAkAoPuQoX@}ZmCcK}Z_B_t@oXsKg_@wIi@{YbQxWigA~Zu\\rg@_}@cm@ad@mWx[zIub@wBye@nGgr@uZk_@aGmu@jCkn@yAqMivBgMi`Ao~@sDxCmKpn@aHk@{Q_U}WkOyv@~\\~D}a@aR~CiR_c@ut@n@qr@{v@{y@\\cFxJqFcPcr@y}@mAmOaSj@s@jS_[mGo`@~s@eD{dBkA{SiDuCMkd@qR{W|CXqDoDDsRaf@sKes@jE}`Ao`@{c@ecAsy@_~@yi@kb@w]ww@gj@lh@nAxG",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1504340226000,
        "start_date_local": 1504347426000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 7.433,
        "max_speed": 18.9,
        "average_watts": 144.2,
        "average_heartrate": 160.0,
        "max_heartrate": 192.0,
        "total_elevation_gain": 799.0,
        "gear_id": "b1232920",
        "moving_time": 11256,
        "elapsed_time": 11562,
        "total_photo_count": 1
    },
    {
        "id": "1165987359",
        "name": "Partie de manivelles avec les assurances Dauphin",
        "athlete": {
            "id": 1321007
        },
        "distance": 147968.0,
        "type": "Ride",
        "map": {
            "id": "a1165987359",
            "polyline": null,
            "summary_polyline": "kpliHk|uLpt@~`CaSfkEpHbgCqQf_B|KcRp]rS_ExQjJpJuY~iBzAlc@qHpi@pF`Kof@dLhL|p@gp@kEqCbs@zYxICnMxW_K~K|R~GwAvDfTmIv~Aht@zbBhMtkA|oAdeCinAjnEiKlaAzFxb@sr@yUw{@jtDmb@b`Ajj@`n@|A`Xdj@le@vAbPzsAdNj^fk@~D|i@iJpaAgKtf@oYxc@jLfb@td@lX|v@sIzQvtA|gAl_CfoApOc{A~fDgKtn@{Iz@}`@x_Ayf@|_ElQxiA{Cfz@fEbHcPlSmCnj@wRzf@eY~f@yTmNqg@{fAm~@gz@sbB~i@q^||@tXbx@HzjBeZrlA{c@zPvBtHcKbK}Pr}@}Bp[`LxPwD`k@nWrgAv@hf@d`@jaA`[lSiAxV~Ph@rNta@zI~tAltAhrCpx@fC`_@o[no@}QhNkVmMksBq[qy@_Gcf@nAcs@dT}w@r`@oY~Oih@pu@{Tzs@wrAjPip@c]yxCuu@kt@mh@}Q{h@um@oY|C}ZqUge@{dA}h@ug@`bAktC|w@s|DkFo]{RqTvM}|@d_@_^pTu|@jH}sA{HaiDjKan@jZs[jIgb@oAodAla@mp@rPskAJyyDiMqDc\\ux@gJks@_Xw[mD_aA~K{`@|NsHjIgg@zVg[dYqdAhTkZrPN~IsUoLwi@iFqyAbMqv@wvAqrBmd@uApBmxBsi@EkWwS_Kyb@hKuLkLoc@}n@bHgLvSsi@{OwNc[chAwVKkg@rtAosBzUuuA{LuIfC_W_n@y\\tQq_BeIeiCpZa{FsDc^kb@kRyQqa@",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1504414319000,
        "start_date_local": 1504421519000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 7.777,
        "max_speed": 15.9,
        "average_watts": 149.1,
        "average_heartrate": 148.9,
        "max_heartrate": 184.0,
        "total_elevation_gain": 1292.0,
        "gear_id": "b1232920",
        "moving_time": 19027,
        "elapsed_time": 23516,
        "total_photo_count": 0
    },
    {
        "id": "1175077006",
        "name": "Les cols de Paris en single speed",
        "athlete": {
            "id": 1321007
        },
        "distance": 238459.5,
        "type": "Ride",
        "map": {
            "id": "a1175077006",
            "polyline": null,
            "summary_polyline": "uymiHcgxLuC{HnHiM`P{LdENnHyKbDq@tDqGzEqChSa`@rDsRnAuXxD_TZm[zAqEbBi`@fAyCcAmGvCkHfD_[P}OzC{S_@iBlIe\\i@iDxFwKdI}FvMoRtAgE[sNdIgBxJyZtRsKfa@qIhJ~H~PdFgWhsAnd@uf@pwAaVtf@uOpD]fEbE`D_Jjd@kLhIklAaJyHsBaWsOyMOoFeDRyAlDmg@pZ}CdEci@dC_CjPoQ_HgAm@C_CxAwM^m\\m@Wo@dDqFmClEgRuA{FwDzAyJf_@q@jGfCUj@lEmGfAoEhHsM}EmEpReHcDkAiEt@cGvAH_BnBaP_HDaJ}BjRoDkA`Ex]ck@aHa@cBlFsc@{BvGqa@gRm@cD_o@fl@kLOfH\\FrCcAc@`CjC~CpYkGlC\\fI_ClCgDnMqAV|AO}H~ZsByBvA{Nk@}DxA}FT_RtCi@AoDAvCwCh@YfEuACi@|HyCdJdDbCkBlI_CZoBaGU~ErF~J|KtJnNxYzOd}AsJnJgI`g@oC`]mAdBl@fIyBz[wBbHm@f[aH~|@yPn`@qy@z_AvBbJ",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1504937194000,
        "start_date_local": 1504944394000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 5.728,
        "max_speed": 18.7,
        "average_watts": 92.2,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 281.0,
        "gear_id": "b4192689",
        "moving_time": 6714,
        "elapsed_time": 7715,
        "total_photo_count": 5
    },
    {
        "id": "1177000043",
        "name": "Allegro ma non troppo",
        "athlete": {
            "id": 1321007
        },
        "distance": 72413.1,
        "type": "Ride",
        "map": {
            "id": "a1177000043",
            "polyline": null,
            "summary_polyline": "oplhHaneLmDtw@lGpv@vA~gAsX`dE_Md]w_@QcJlUySzgA}a@b~A}Tdg@e`@xWcMpQqCxRnDfbAqWvj@?pj@mHj`@|Hpi@aIxe@`cAvuCLt\\gZjd@zHl\\jq@iFrh@~c@hJcDiAtR_Wlu@`SjNqVznBfBhPqFrNhO`UkFjJL~NdWxYxTzi@zEy@dBjv@vI|c@QbKoPn]{iB~XbJhf@jKpxAa]p`AjZhCjZvm@lT|L|^^fN`VhGfW~\\gNzEtv@xDrI~h@jHnNrNvh@pGdKfPr^pSxSix@tRalA|GuQpQaRlHsb@xRof@pHi_AzG{Mv`@e_B|BsiAhIkHo@q\\|MyQzHyxAzOnBdN_SrQik@~NuQ|KiEyAgUm[{nAp@ad@sLarAyQ{k@zaAimFqPmJcBgGyHeoBkM_{A~Hif@{N{|@j@{JyKoYxCqLMa|AyQisAge@sLau@ik@mLbO}AuBpCeOiMl\\OcNoO`CiUyYY_G_Tu@sFm}@e]_h@fKgV_@cNvK{GEmMkoCyqCaDsDjAqA",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1505027867000,
        "start_date_local": 1505035067000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.74,
        "max_speed": 14.0,
        "average_watts": 172.0,
        "average_heartrate": 157.2,
        "max_heartrate": 187.0,
        "total_elevation_gain": 364.0,
        "gear_id": "b1232920",
        "moving_time": 8285,
        "elapsed_time": 8320,
        "total_photo_count": 0
    },
    {
        "id": "1178617123",
        "name": "Sortie à vélo matinale",
        "athlete": {
            "id": 1321007
        },
        "distance": 23268.0,
        "type": "Ride",
        "map": {
            "id": "a1178617123",
            "polyline": null,
            "summary_polyline": "gwmiHehxLqAuF`A{A|w@cx@jNq[bJku@nPcfCpFm_@~IuMcAoX{Jy{@qHgSpKej@rBgSoG}g@_EgaAd@weAfIgJn\\JvKkQfmAoxAf[sJpMy^j]wWpUcElFuwAx@mAvDg{AaC_@eM}UB_M|BYj@}KmBy@r@aw@nEaN|@oP_DqCyKsXcOy@}DuEpB}^q@{ViA_K_EgJi@aNxGgc@|Akn@u@k[uF{OfAtGeDdF",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505109192000,
        "start_date_local": 1505116392000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 5.913,
        "max_speed": 13.1,
        "average_watts": 125.7,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 259.5,
        "gear_id": "b4192689",
        "moving_time": 3935,
        "elapsed_time": 4474,
        "total_photo_count": 0
    },
    {
        "id": "1179278948",
        "name": "Evening Ride",
        "athlete": {
            "id": 1321007
        },
        "distance": 22213.9,
        "type": "Ride",
        "map": {
            "id": "a1179278948",
            "polyline": null,
            "summary_polyline": "azdiHgkeNxGu@dCpBwBjXv@`J_@za@_Hre@v@nNvDhI|@xI\\t\\}BdWbEpHtMM~F`R|BpiAwC~u@hEzIv@nUzFfVyMbvCmOlCu`@jXeHbOiCjMiZxLaYfYcVt]ii@fn@a_@zBkHdJgAj[J|e@xB|p@hJl|@}Np_A~DlIfMheA`BpXuIbLmHtj@yBn\\oB~Fp@zD_BrWiNzgBiQba@{b@|b@~@tJrN`c@gAn@",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505147363000,
        "start_date_local": 1505154563000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 6.101,
        "max_speed": 11.1,
        "average_watts": 97.2,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 108.0,
        "gear_id": "b4192689",
        "moving_time": 3641,
        "elapsed_time": 3921,
        "total_photo_count": 0
    },
    {
        "id": "1183202076",
        "name": "Sortie à vélo matinale",
        "athlete": {
            "id": 1321007
        },
        "distance": 23177.3,
        "type": "Ride",
        "map": {
            "id": "a1183202076",
            "polyline": null,
            "summary_polyline": "mwmiH{gxLq@}Hxy@ey@xOu_@dHeq@~GupA~AsCa@mD~AgY~I_q@dm@ww@dd@wYhY|RtDdAv@eBfSa~@fGmd@jCu_@bJch@tZmjAvEiJpUmOrMwRsDey@d]{|@dIcm@dAQz@qI~Y}dAdGs]y@iUwBkL_HuXkNqZoDwN_Ga^RoXiXoEpC{m@aGzA|A}XuQcHeLeYmOOuCgFvBm[Q}Rc@cL_EyLsAiPzGsd@pA{m@y@u\\aHzDgAeC",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505369801000,
        "start_date_local": 1505377001000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 6.217,
        "max_speed": 12.8,
        "average_watts": 99.0,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 102.0,
        "gear_id": "b4192689",
        "moving_time": 3728,
        "elapsed_time": 3982,
        "total_photo_count": 0
    },
    {
        "id": "1183860932",
        "name": "Evening Ride",
        "athlete": {
            "id": 1321007
        },
        "distance": 22928.5,
        "type": "Ride",
        "map": {
            "id": "a1183860932",
            "polyline": null,
            "summary_polyline": "_zdiHejeN~GsAx@~KWzz@cHbh@fAjOdD|Gx@rIb@l\\sBbZzB`EbLg@nDfCvCrJpBtRbJuA`QvEtElE}HdR_C|l@xWtEOhRbJbh@hQrb@`Kjc@z@rQs@fMec@b`B{Kvw@om@x_BuXfL_@pOyHx\\{Mj~@gy@hvDiMeIab@lVqp@r{@kIlo@iBzZaB~Cd@nGmH|kA_H~r@cPj^uc@~e@~Otj@g@zA",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505405402000,
        "start_date_local": 1505412602000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 6.194,
        "max_speed": 10.1,
        "average_watts": 95.1,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 93.0,
        "gear_id": "b4192689",
        "moving_time": 3702,
        "elapsed_time": 4104,
        "total_photo_count": 0
    },
    {
        "id": "1184662966",
        "name": "Sortie à vélo matinale",
        "athlete": {
            "id": 1321007
        },
        "distance": 23964.0,
        "type": "Ride",
        "map": {
            "id": "a1184662966",
            "polyline": null,
            "summary_polyline": "_wmiH_hxLuAqGnz@uz@vOw_@`Iap@hGcpAhBoDk@aFtAaX`Jip@bf@aq@tk@ia@zVlQnGbBzSs~@tGeb@fEyf@rIge@p[yiA`PcE`u@}hAwFcRiL_R{@{KdQyc@pHgl@lAu@XiF~_@mwAnBqNOkJmDkX_J_]qMsX{Jmi@`DsqAiA`EiTqEqHlEzAyYiPsFsMaZuJiE{F`@o@eBzBs]u@aZgEmOsAqOpGqc@zAep@k@y[_HoPc@j@xBfF_AdB",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505455710000,
        "start_date_local": 1505462910000,
        "private": false,
        "resource_state": 2,
        "location_city": "Courbevoie",
        "location_state": "Île-de-France",
        "location_country": "France",
        "average_speed": 6.868,
        "max_speed": 16.9,
        "average_watts": 116.9,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 124.0,
        "gear_id": "b4192689",
        "moving_time": 3489,
        "elapsed_time": 3796,
        "total_photo_count": 0
    },
    {
        "id": "1185320347",
        "name": "Evening Ride",
        "athlete": {
            "id": 1321007
        },
        "distance": 24597.8,
        "type": "Ride",
        "map": {
            "id": "a1185320347",
            "polyline": null,
            "summary_polyline": "uvdiHomeNNpCdDSj@rTo@dDt@hAj@oByADNxm@sG`e@`AvM`DtHhAnKXn[yB~QNpFfD~E~Iw@~CtBvEzNhAfOnG}A~RnE|FlFyEtJfTrD_Czn@`AR[~InDlEUpFiChChI`d@dQdb@xK~h@h@tQcChPkGpPxIrTrJhd@kSf]l@xCgLzLzApOnPx\\aPpWaNlLyBjFuFfF}@qArBrFcx@piAuMhCk[niA_^n~BsOro@_X}NgEkDq@iDyEiCiGdToRtLkn@ry@{Ixn@{Br\\{AfB|@lE{@pOgG~_A}G`q@}Pr_@ez@xz@vAvF",
            "resource_state": 2
        },
        "trainer": false,
        "commute": true,
        "manual": false,
        "gear": null,
        "start_date": 1505492561000,
        "start_date_local": 1505499761000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 6.245,
        "max_speed": 10.8,
        "average_watts": 90.6,
        "average_heartrate": null,
        "max_heartrate": null,
        "total_elevation_gain": 90.0,
        "gear_id": "b4192689",
        "moving_time": 3939,
        "elapsed_time": 4337,
        "total_photo_count": 0
    },
    {
        "id": "1186197843",
        "name": "Réapprendre à utiliser le derailleur ",
        "athlete": {
            "id": 1321007
        },
        "distance": 84615.4,
        "type": "Ride",
        "map": {
            "id": "a1186197843",
            "polyline": null,
            "summary_polyline": "_gfiHa_vKbl@b@qCxrCwV`f@cKnd@mQhSkY~q@rIdQuB~Hqp@`nA{UlP}Sl~B_Lxg@|Cf\\uBvK_My@c{@hsDib@j`AlUtQvH`WvJnD|AdWvF[r`@ld@bCxQhWnHpCmGfWlKj^t@`q@bcApKoB|CmP|E{Dl\\f\\~ORfWem@~j@aElCdQdQjMaAnO~IhZpd@ta@r]qL`KjNnDiRnIZjEtt@vGbH|G~a@c@~x@vOvk@_BtSvDpSzOtVO`{BkZ`bDeL~_@fAlz@sQ`}@sQla@fKze@jCdl@_Chh@lNvhA}jBrf@k[pBiM`QyVfw@uXiGiIeQ_SuNiQjUwEhp@qj@ngAwM|J}`AuFqKaIaQz@sOw\\}o@dHgPmPsj@uQkQo\\mIcCu@eDvE_MmGib@cg@ubAeFogAw]w~@mAaZ|EuSbOaHdJyQxm@yFfD}F`D_a@rIcJlDmf@hIsRnBsb@iFqeDfGkQ@kXfT{Gc_@}OaZgc@~g@y_A`x@sa@gIyJeC}LkdAanAyIeR{\\}DsDoj@nLmaAYun@jBoGaDmFvDcTu@kMxw@m_ArLsl@rh@_kAv{@ytD~KvBrCaMxMoGlKvDlJ{`AvQ_a@`Zs}AdT}b@fK}_@f@mNgVci@zZmt@rOwPbG}Y|Ymq@xCiqCkn@_A",
            "resource_state": 2
        },
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1505545357000,
        "start_date_local": 1505552557000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.368,
        "max_speed": 15.5,
        "average_watts": 164.8,
        "average_heartrate": 156.2,
        "max_heartrate": 192.0,
        "total_elevation_gain": 690.0,
        "gear_id": "b1232920",
        "moving_time": 10112,
        "elapsed_time": 10284,
        "total_photo_count": 0
    },
    {
        "id": "1186197844",
        "name": "Trainer",
        "athlete": {
            "id": 1321007
        },
        "distance": 84615.4,
        "type": "Ride",
        "trainer": true,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1505545357000,
        "start_date_local": 1505552557000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.368,
        "max_speed": 15.5,
        "average_watts": 164.8,
        "average_heartrate": 156.2,
        "max_heartrate": 192.0,
        "total_elevation_gain": 690.0,
        "gear_id": "b1232920",
        "moving_time": 10112,
        "elapsed_time": 10284,
        "total_photo_count": 0
    },
    {
        "id": "1186197845",
        "name": "Manual",
        "athlete": {
            "id": 1321007
        },
        "distance": 84615.4,
        "type": "Ride",
        "trainer": false,
        "commute": false,
        "manual": true,
        "gear": null,
        "start_date": 1505545357000,
        "start_date_local": 1505552557000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.368,
        "max_speed": 15.5,
        "average_watts": 164.8,
        "average_heartrate": 156.2,
        "max_heartrate": 192.0,
        "total_elevation_gain": 690.0,
        "gear_id": "b1232920",
        "moving_time": 10112,
        "elapsed_time": 10284,
        "total_photo_count": 0
    },
    {
        "id": "1186197846",
        "name": "Run 0-10km",
        "athlete": {
            "id": 1321007
        },
        "distance": 9615.4,
        "type": "Run",
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1505545357000,
        "start_date_local": 1505552557000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.368,
        "max_speed": 15.5,
        "average_watts": 164.8,
        "average_heartrate": 156.2,
        "max_heartrate": 192.0,
        "total_elevation_gain": 690.0,
        "gear_id": "s4119602",
        "moving_time": 10112,
        "elapsed_time": 10284,
        "total_photo_count": 0
    },
    {
        "id": "1186197847",
        "name": "Run 10-20km",
        "athlete": {
            "id": 1321007
        },
        "distance": 15615.4,
        "type": "Run",
        "trainer": false,
        "commute": false,
        "manual": false,
        "gear": null,
        "start_date": 1505545357000,
        "start_date_local": 1505552557000,
        "private": false,
        "resource_state": 2,
        "location_city": null,
        "location_state": null,
        "location_country": "France",
        "average_speed": 8.368,
        "max_speed": 15.5,
        "average_watts": 164.8,
        "average_heartrate": 156.2,
        "max_heartrate": 192.0,
        "total_elevation_gain": 690.0,
        "gear_id": "s4119602",
        "moving_time": 10112,
        "elapsed_time": 10284,
        "total_photo_count": 0
    }
];


describe('Statistics', function () {
    it('should initialize statistics properly', function () {

        let statistics = new Statistics(true, athleteProfile);
        statistics.addAll(activities);

        assert.equal(statistics.globalTotals.nb, 15, 'global totals nb');
        assert.equal(statistics.commuteTotals.nb, 6, 'commute totals nb');
        assert.equal(statistics.trainerTotals.nb, 1, 'trainer totals nb');
        assert.equal(statistics.manualTotals.nb, 1, 'trainer totals nb');
        assert.equal(statistics.noCommuteTotals.nb, 9, 'no commute totals nb');
        assert.equal(statistics.bikeDistanceTotals0_50.nb, 6, 'ride 0-50 km totals nb');
        assert.equal(statistics.bikeDistanceTotals50_100.nb, 4, 'ride 50-100 km totals nb');
        assert.equal(statistics.bikeDistanceTotals100_150.nb, 1);
        assert.equal(statistics.bikeDistanceTotals150_200.nb, 1);
        assert.equal(statistics.bikeDistanceTotals200.nb, 1);
        assert.equal(statistics.runDistanceTotals0_10.nb, 1, 'run 0-10 km totals nb');
        assert.equal(statistics.runDistanceTotals10_20.nb, 1, 'run 10-20 km totals nb');
        assert.equal(statistics.runDistanceTotals20_30.nb, 0, 'run 20-30 km totals nb');
        assert.equal(statistics.runDistanceTotals30_40.nb, 0, 'run 30-40 km totals nb');
        assert.equal(statistics.runDistanceTotals40.nb, 0, 'run 40 km totals nb');

        let gearTotals = statistics.gearTotals;
        assert.equal(gearTotals['b1232920'].nb, 6, 'gear totals BH G5');
        assert.equal(gearTotals['b4192689'].nb, 7, 'gear totals Fixie Inc');
        assert.equal(gearTotals['s4119602'].nb, 2, 'gear totals Adidas');

    });

    it('should update trainer attribute properly', function () {
        let statistics = new Statistics(true, athleteProfile);
        statistics.addAll([activities[0]]);

        let editedActivity = {
            trainer: true,
            commute: activities[0].commute,
            gear_id: activities[0].gear_id
        };

        statistics.updateActivity(editedActivity, activities[0]);

        assert.equal(statistics.trainerTotals.nb, 1, 'trainer totals should be 1');
        assert.equal(activities[0].trainer, true, 'trainer should be true');
    });

    it('should update commute attribute properly', function () {
        let statistics = new Statistics(true, athleteProfile);
        statistics.addAll([activities[0]]);

        let editedActivity = {
            trainer: activities[0].trainer,
            commute: true,
            gear_id: activities[0].gear_id
        };

        assert.equal(statistics.commuteTotals.nb, 0, 'commute totals should be 0 before update');
        assert.equal(statistics.noCommuteTotals.nb, 1, 'no commute totals should be 1 before update');

        statistics.updateActivity(editedActivity, activities[0]);

        assert.equal(statistics.commuteTotals.nb, 1, 'commute totals should be 1');
        assert.equal(statistics.noCommuteTotals.nb, 0, 'no commute totals should be 0');
        assert.equal(activities[0].commute, true, 'commute should be true');
    });


    it('should update gear id properly', function () {
        let statistics = new Statistics(true, athleteProfile);
        statistics.addAll([activities[0]]);

        assert.equal(statistics.gearTotals['b1232920'].nb, 1, 'gear totals BH G5 should be 1 before update');

        let editedActivity = {
            trainer: activities[0].trainer,
            commute: activities[0].commute,
            gear_id: "b1534132"
        };

        statistics.updateActivity(editedActivity, activities[0]);

        assert.equal(statistics.gearTotals['b1232920'].nb, 0, 'gear totals BH G5 should be 0 after update');
        assert.equal(statistics.gearTotals['b1534132'].nb, 1, 'gear totals Kona Dr Good should be 1 after update');
        assert.equal(statistics.gearTotals['b1534132'].title, 'Kona Dr Good', 'gear totals title');
    });
});