<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>tonr</title>
</head>
<body>
<div id="container">

    <div id="content">
        <form id="loginForm" action="<c:url value="/login.do"/>" method="post">
                <input name="login" value="Login" type="submit"/>
        </form>
        <script type="application/javascript">
            document.getElementById("loginForm").submit();
        </script>

    </div>
</div>
</body>
</html>