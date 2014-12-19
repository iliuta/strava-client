<%@ taglib prefix="authz" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>tonr</title>
</head>
<body>
<div id="container">

    <div id="content">
        <h1>Profile</h1>

        <ul>
            ${profile.firstName}
        </ul>
        <ul>
            <c:forEach var="bike" items="${profile.bikes}">
                                ${bike.name}, ${bike.distance/1000}km <br/>
            </c:forEach>
        </ul>
    </div>
</div>
</body>
</html>