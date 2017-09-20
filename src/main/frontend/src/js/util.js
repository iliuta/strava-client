function durationString(seconds) {
        var result = "";
        var minutes = Math.floor(seconds / 60);

        var reminderSeconds = seconds % 60;

        result = reminderSeconds + "s";

        if (minutes > 60) {
            var hours = Math.floor(minutes / 60);

            var reminderMinutes = minutes % 60;

            result = reminderMinutes + "min:" + result;

            if (hours > 24) {
                var days = Math.floor(hours / 24);

                var reminderHours = hours % 24;

                result = days + "d:" + reminderHours + "h:" + result;

            } else if (hours > 0) {
                result = hours + "h:" + result;

            }
        } else if (minutes > 0) {
            result = minutes + "min:" + result;
        }

        return result;
    };


function profileImageUrlOrDefault(profileImageUrl) {
        var result = "";

        if (profileImageUrl && profileImageUrl.startsWith("http")) {
            result = profileImageUrl;
        } else {
            result = "https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large-63758b9942e3f074c3ecb84db07928ee.png";

        }

        return result;
    };

export {durationString, profileImageUrlOrDefault}