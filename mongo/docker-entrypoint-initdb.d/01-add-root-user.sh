USERNAME=$MONGO_INITDB_ADMIN_USERNAME
echo ">> Creating user $USERNAME as admin on $MONGO_INITDB_DATABASE..."
"${mongo[@]}" "$rootAuthDatabase" <<-EOJS
	var userProps = {
		pwd: $(jq --arg 'pwd' "$MONGO_INITDB_ROOT_PASSWORD" --null-input '$pwd'),
		roles: [ { role: 'readWrite', db: $(jq --arg 'db' "$MONGO_INITDB_DATABASE" --null-input '$db') } ]
	};

	db = db.getSiblingDB("$MONGO_INITDB_DATABASE");
	print(db);

	if (db.getUser("$USERNAME")) {
		print(">> User $USERNAME exists. Updating.");
		db.updateUser("$USERNAME", userProps);
		quit();
	}

	db.getUser("$USERNAME") || db.createUser(Object.assign(
		{
			user: $(jq --arg 'user' "$USERNAME" --null-input '$user'),
		},
		userProps
	));
EOJS
echo ">> $USERNAME created or updated."
