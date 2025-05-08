import Section from "@ui/section";
import { useUser } from "@contexts/user-context";

const ProfileBio = () => {
    const { username, email } = useUser();
    return (
        <Section className="profile-area" space="bottom">
            <div className="tw-container tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-7.5 tw-items-start lg:tw-items-center">
                <figure className="tw-col-span-full md:tw-col-span-6 xl:tw-col-span-5">
                    <img
                        className="tw-w-full"
                        src="/images/profile/profile.jpeg"
                        alt="profile"
                        width={470}
                        height={470}
                    />
                </figure>
                <div className="tw-col-span-full md:tw-col-[7/-1]">
                    <h2 className="tw-mb-0 tw-leading-[1.42]">
                        {username}
                    </h2>
                    <p className="tw-mb-0 tw-mt-3.8">
                        {email}
                    </p>
                </div>
            </div>
        </Section>
    );
};

export default ProfileBio;
