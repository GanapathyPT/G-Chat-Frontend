import { Dimmer, Loader } from "semantic-ui-react";

function AppLoader() {
	return (
		<Dimmer active inverted>
			<Loader size="large">Loading</Loader>
		</Dimmer>
	);
}

export { AppLoader };
