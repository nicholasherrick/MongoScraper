$(document).ready(function () {
    AOS.init();
    // $(".comment").hide();
    $('[data-toggle="tooltip"]').tooltip();

    $(document.body).on("click", "#register-button", function (event) {
        event.preventDefault();
        var user = {
            email: $("#register-email").val().trim(),
            password: $("#register-password").val().trim(),
            username: $("#register-username").val().trim(),
            firstName: $("#register-first").val().trim(),
            lastName: $("#register-last").val().trim()
        }
        $.post("/api/register", user).then(function (response) {
            window.location.replace(response)
        }).catch(function (err) {
            console.log(err);
        });
    });

    $(document.body).on("click", "#login-button", function (event) {
        event.preventDefault();
        var user = {
            username: $("#login-username").val().trim(),
            password: $("#login-password").val().trim()
        }
        $.post("/api/login", user).then(function (response) {
            window.location.replace(response)
        }).catch(function (err) {
            console.log(err);
        });
    });

    $(document.body).on("click", ".save-button", function (event) {
        var articleId = $(this).data("id");
        $.get("/api/save-article/" + articleId).then(function (response) {
            window.location.replace(response);
        }).catch(function (err) {
            console.log(err);
        });
    });

    $(document.body).on("click", ".delete-saved-button", function (event) {
        var articleId = $(this).data("id");
        $.ajax(
            {
                url: "/api/delete-saved-article/" + articleId,
                method: "DELETE",
                success: function (response) {
                    window.location.replace(response);
                }
            }
        );
    });


    $(document.body).on("click", ".save-forum-button", function (event) {
        var articleId = $(this).data("id");
        $.get("/api/save-forum-article/" + articleId).then(function (response) {
            window.location.replace(response);
        }).catch(function (err) {
            console.log(err);
        });
    });

    $(document.body).on("click", ".add-comment-button", function (event) {
        var articleId = $(this).data("id");
        $(document.body).on("click", "#post-comment-button", function (event) {
            event.preventDefault();
            var comment = {
                body: $("#comment-text").val().trim()
            }
            $.post("/api/post-comment/" + articleId, comment).then(function (response) {
                window.location.replace(response);
            }).catch(function (err) {
                console.log(err);
            });
        });
    });

    $(document.body).on("click", ".view-comments-button", function (event) {
        commentDivId = $(this).data("id");
        $("#" + commentDivId).toggle();
    });

    $(document.body).on("click", ".delete-comment", function (event) {
        var commentId = $(this).data("commentid");
        $.ajax(
            {
                url: "/api/delete-comment/" + commentId,
                method: "DELETE",
                success: function (response) {
                    window.location.replace(response);
                }
            }
        );

    });

    $(document.body).on("click", ".delete-forum-button", function(event) {
        var forumArticleId = $(this).data("id");
        $.ajax(
            {
                url: "/api/delete-forum-article/" + forumArticleId,
                method: "DELETE",
                success: function (response) {
                    window.location.replace(response);
                }
            }
        );
    });














});